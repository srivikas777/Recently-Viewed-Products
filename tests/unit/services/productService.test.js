// tests/unit/services/productService.test.js
const ProductService = require('../../../backend/services/productService');
const { mockProduct, mockRecentlyViewed } = require('../../fixtures/products');
const admin = require('firebase-admin');
const redisClient = require('../../../backend/config/redis');

jest.mock('firebase-admin');
jest.mock('redis');

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addRecentlyViewed', () => {
    it('should add new product view', async () => {
      const docGetSpy = admin
        .firestore()
        .collection()
        .doc()
        .collection()
        .doc()
        .get.mockResolvedValueOnce({ exists: false });

      const docSetSpy = admin
        .firestore()
        .collection()
        .doc()
        .collection()
        .doc()
        .set.mockResolvedValueOnce({});

      const invalidateCacheSpy = jest.spyOn(ProductService, 'invalidateCache').mockResolvedValue();

      const result = await ProductService.addRecentlyViewed(
        'test-user-id',
        mockProduct.id,
        mockProduct
      );

      expect(result).toHaveProperty('viewCount', 1);
      expect(docSetSpy).toHaveBeenCalled();
      expect(invalidateCacheSpy).toHaveBeenCalledWith('test-user-id');

      docGetSpy.mockRestore();
      docSetSpy.mockRestore();
      invalidateCacheSpy.mockRestore();
    });

    it('should increment view count for existing product', async () => {
      const now = admin.firestore.Timestamp.now();
      const docGetSpy = admin
        .firestore()
        .collection()
        .doc()
        .collection()
        .doc()
        .get.mockResolvedValueOnce({
          exists: true,
          data: () => ({
            viewCount: 1,
            lastViewed: now,
            firstViewed: now,
            createdAt: now,
            updatedAt: now,
          }),
        });

      const docSetSpy = admin
        .firestore()
        .collection()
        .doc()
        .collection()
        .doc()
        .set.mockResolvedValueOnce({});

      const invalidateCacheSpy = jest.spyOn(ProductService, 'invalidateCache').mockResolvedValue();

      const result = await ProductService.addRecentlyViewed(
        'test-user-id',
        mockProduct.id,
        mockProduct
      );

      expect(result).toHaveProperty('viewCount', 2);
      expect(docSetSpy).toHaveBeenCalled();
      expect(invalidateCacheSpy).toHaveBeenCalledWith('test-user-id');

      docGetSpy.mockRestore();
      docSetSpy.mockRestore();
      invalidateCacheSpy.mockRestore();
    });
  });

  describe('getRecentlyViewed', () => {
    it('should return cached products when available', async () => {
      const cachedData = JSON.stringify([mockRecentlyViewed]);
      const redisGetSpy = jest.spyOn(redisClient, 'get').mockResolvedValue(cachedData);

      const result = await ProductService.getRecentlyViewed('test-user-id');

      expect(redisGetSpy).toHaveBeenCalledWith('user:test-user-id:recentlyViewed');
      expect(result).toEqual([mockRecentlyViewed]);

      redisGetSpy.mockRestore();
    });

    it('should fetch from Firestore when cache misses', async () => {
      const redisGetSpy = jest.spyOn(redisClient, 'get').mockResolvedValue(null);
      const redisSetExSpy = jest.spyOn(redisClient, 'setEx').mockResolvedValue('OK');

      const firestoreGetSpy = admin
        .firestore()
        .collection()
        .doc()
        .collection()
        .orderBy()
        .limit()
        .get.mockResolvedValueOnce({
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

      const result = await ProductService.getRecentlyViewed('test-user-id');

      expect(redisGetSpy).toHaveBeenCalledWith('user:test-user-id:recentlyViewed');
      expect(redisSetExSpy).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);

      redisGetSpy.mockRestore();
      redisSetExSpy.mockRestore();
      firestoreGetSpy.mockRestore();
    });
  });
});
