// tests/integration/api.test.js
const request = require('supertest');
const app = require('../../backend/app');
const { mockProduct } = require('../fixtures/products');
const admin = require('firebase-admin');
const redisClient = require('../../backend/config/redis');

jest.mock('firebase-admin');
jest.mock('redis');

describe('API Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    authToken = 'mock-token';
    // Mock verifyIdToken to return a user ID
    admin.auth().verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });
  });

  afterAll(async () => {
    await redisClient.disconnect();
  });

  describe('Products API', () => {
    describe('GET /api/v1/products/recent', () => {
      it('should require authentication', async () => {
        const response = await request(app).get('/api/v1/products/recent');

        expect(response.status).toBe(401);
      });

      it('should return recently viewed products', async () => {
        const mockProducts = [mockProduct];
        // Mock the service method if needed
        const redisGetSpy = jest.spyOn(redisClient, 'get').mockResolvedValue(null);
        const firestoreGetSpy = admin.firestore().collection().doc().collection().orderBy().limit().get.mockResolvedValueOnce({
          forEach: (callback) => {
            callback({
              id: mockProduct.id,
              data: () => ({
                ...mockRecentlyViewed,
                lastViewed: admin.firestore.Timestamp.now(),
                firstViewed: admin.firestore.Timestamp.now(),
                createdAt: admin.firestore.Timestamp.now(),
                updatedAt: admin.firestore.Timestamp.now(),
              }),
            });
          },
        });

        const response = await request(app)
          .get('/api/v1/products/recent')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        redisGetSpy.mockRestore();
        firestoreGetSpy.mockRestore();
      });
    });

    describe('POST /api/v1/products/view', () => {
      it('should record product view', async () => {
        // Mock Firestore operations
        const docGetSpy = admin.firestore().collection().doc().collection().doc().get.mockResolvedValueOnce({
          exists: false,
          data: jest.fn(),
        });
        const docSetSpy = admin.firestore().collection().doc().collection().doc().set.mockResolvedValueOnce({});

        const response = await request(app)
          .post('/api/v1/products/view')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            productId: mockProduct.id,
            productData: mockProduct,
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('viewCount');

        docGetSpy.mockRestore();
        docSetSpy.mockRestore();
      });

      it('should handle invalid product data', async () => {
        const response = await request(app)
          .post('/api/v1/products/view')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            productId: null,
          });

        expect(response.status).toBe(400);
      });
    });
  });
});
