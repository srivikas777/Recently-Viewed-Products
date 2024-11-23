// tests/jest.setup.js
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'testpass';
process.env.FRONTEND_URL = 'http://localhost:3000';

jest.mock('firebase-admin');
jest.mock('redis');
