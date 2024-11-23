// backend/services/productService.js
const { admin, firestore } = require('../config/firebase');
const redisClient = require('../config/redis');
const { sendEmail } = require('../config/email');

class ProductService {
    static async shouldSendNotification(viewCount, lastViewed) {
        // Checking if view count > 2 and last view was within an hour
        return viewCount >= 2 && 
               (Date.now() - lastViewed.toDate().getTime()) <= (60 * 60 * 1000);
    }
    
    static async getRecentlyViewed(userId) {
        const cacheKey = `user:${userId}:recentlyViewed`;
        
        try {
            //Redis connection check
            console.log('Checking Redis connection...');
            const ping = await redisClient.ping();
            console.log('Redis PING response:', ping);

            // List all keys
            const allKeys = await redisClient.keys('*');
            console.log('All Redis keys:', allKeys);

            const cachedData = await redisClient.get(cacheKey);
            console.log('Cached data exists:', !!cachedData);
            
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                console.log('Found', parsed.length, 'cached products');
                return parsed;
            }

            const snapshot = await firestore
                .collection('users')
                .doc(userId)
                .collection('recentlyViewed')
                .orderBy('lastViewed', 'desc')
                .limit(10)
                .get();

            const products = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                products.push({
                    id: doc.id,
                    ...data,
                    lastViewed: data.lastViewed.toDate(),
                    firstViewed: data.firstViewed.toDate(),
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt.toDate()
                });
            });

            console.log('Found', products.length, 'products in Firestore');

            if (products.length > 0) {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));
                console.log('Cached products in Redis with key:', cacheKey);
                
                const verification = await redisClient.get(cacheKey);
                console.log('Cache verification:', !!verification);
            }

            return products;
        } catch (error) {
            console.error('Error in getRecentlyViewed:', error);
            throw error;
        }
    }

    static async invalidateCache(userId) {
        const cacheKey = `user:${userId}:recentlyViewed`;
        try {
            await redisClient.del(cacheKey);
            console.log(`Cache invalidated for key: ${cacheKey}`);
        } catch (error) {
            console.error('Error invalidating cache:', error);
        }
    }
    

    static async addRecentlyViewed(userId, productId, productData) {
        try {
            const docRef = firestore
                .collection('users')
                .doc(userId)
                .collection('recentlyViewed')
                .doc(productId.toString());

            const now = admin.firestore.Timestamp.now();
            const doc = await docRef.get();
            
            let viewCount = 1;
            let shouldNotify = false;
            
            if (doc.exists) {
                const currentData = doc.data();
                viewCount = (currentData.viewCount || 0) + 1;
                shouldNotify = await this.shouldSendNotification(viewCount, currentData.lastViewed);
            }

            await docRef.set({
                productId: productId.toString(),
                viewCount,
                lastViewed: now,
                updatedAt: now,
                productData,
                firstViewed: doc.exists ? doc.data().firstViewed : now,
                createdAt: doc.exists ? doc.data().createdAt : now
            }, { merge: true });

            if (shouldNotify) {
                await this.sendViewNotification(userId, productData, viewCount);
            }

            await this.invalidateCache(userId);

            return {
                viewCount,
                lastViewed: now.toDate(),
                productId
            };
        } catch (error) {
            console.error('Error in addRecentlyViewed:', error);
            throw error;
        }
    }

    static async sendViewNotification(userId, productData, viewCount) {
        try {
            const user = await admin.auth().getUser(userId);
            
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Frequent Product View Alert</h2>
                    <p>You've viewed <strong>${productData.name}</strong> ${viewCount} times in the last hour!</p>
                    
                    <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <img src="${productData.image}" alt="${productData.name}" 
                             style="max-width: 300px; border-radius: 4px;" />
                        
                        <h3 style="color: #333;">${productData.name}</h3>
                        <p style="color: #28a745; font-size: 18px; font-weight: bold;">
                            $${productData.price}
                        </p>
                        <p style="color: #666;">
                            ${productData.description}
                        </p>
                    </div>

                    <p>
                        View times: ${viewCount}<br>
                        Last viewed: ${new Date().toLocaleString()}
                    </p>

                    <div style="margin-top: 20px;">
                        <a href="${process.env.FRONTEND_URL}/products/${productData.id}" 
                           style="background: #007bff; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px;">
                            View Product Again
                        </a>
                    </div>
                </div>
            `;

            await sendEmail(
                user.email,
                `You've viewed ${productData.name} multiple times!`,
                emailHtml
            );

            console.log(`Notification sent to ${user.email} for product ${productData.name}`);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    static async getFromFirestoreOnly(userId) {
        const snapshot = await firestore
            .collection('users')
            .doc(userId)
            .collection('recentlyViewed')
            .orderBy('lastViewed', 'desc')
            .limit(10)
            .get();

        const products = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            products.push({
                id: doc.id,
                ...data,
                lastViewed: data.lastViewed.toDate(),
                firstViewed: data.firstViewed.toDate(),
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            });
        });

        return products;
    }
}

module.exports = ProductService;