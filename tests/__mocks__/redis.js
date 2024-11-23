// tests/__mocks__/redis.js
const redisClientMock = {
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue('Redis is working!'),
    set: jest.fn().mockResolvedValue('OK'),
    setEx: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
    on: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
  };
  
  module.exports = {
    createClient: jest.fn(() => redisClientMock),
  };
  