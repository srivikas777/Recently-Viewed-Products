// frontend/js/services/product.service.js
import { auth } from '../config/firebase.js';

export const productService = {
    async recordProductView(productId, productData) {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('/api/v1/products/view', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId.toString(),
                productData
            })
        });

        if (!response.ok) {
            throw new Error('Failed to record view');
        }

        return response.json();
    },

    async getRecentlyViewed() {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('/api/v1/products/recent', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recently viewed products');
        }

        return response.json();
    },

    generateProducts(count) {
        const products = [];
        const categories = ['Laptop', 'Smartphone', 'Tablet', 'Smartwatch', 'Camera'];
        const brands = ['Tech', 'Smart', 'Pro', 'Elite', 'Ultra'];

        for (let i = 1; i <= count; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const price = Math.floor(Math.random() * 900) + 100;

            products.push({
                id: i,
                name: `${brand} ${category} ${i}`,
                price: price,
                description: `High-quality ${category.toLowerCase()} with amazing features and cutting-edge technology. Perfect for both professional and personal use.`,
                image: `https://picsum.photos/seed/${i}/400/300`
            });
        }

        return products;
    }
};
