// backend/server.js
const app = require('./app');
const redisClient = require('./config/redis');
const { admin } = require('./config/firebase');

(async () => {
  try {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();
