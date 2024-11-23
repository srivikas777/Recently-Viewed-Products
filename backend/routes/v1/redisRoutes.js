// backend/routes/v1/redisRoutes.js
const router = require('express').Router();
const redisClient = require('../../config/redis');

router.get('/redis-test', async (req, res) => {
    try {
        // Test basic operations
        await redisClient.set('test-key', 'test-value');
        const value = await redisClient.get('test-key');
        await redisClient.del('test-key');

        // Get all keys
        const keys = await redisClient.keys('*');

        res.json({
            status: 'Redis is working',
            testValue: value,
            allKeys: keys
        });
    } catch (error) {
        res.status(500).json({
            status: 'Redis error',
            error: error.message
        });
    }
});

module.exports = router;