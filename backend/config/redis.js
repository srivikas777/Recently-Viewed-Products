// backend/config/redis.js
const Redis = require('redis');

const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis reconnection failed');
                return new Error('Redis max retries reached');
            }
            return Math.min(retries * 100, 3000);
        }
    }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('ready', () => console.log('Redis Client Ready'));
redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting'));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis connection test:');
        await redisClient.set('test', 'Redis is working!');
        const testValue = await redisClient.get('test');
        console.log('Test value:', testValue);
        await redisClient.del('test');
    } catch (error) {
        console.error('Redis connection error:', error);
    }
};

connectRedis();

module.exports = redisClient;