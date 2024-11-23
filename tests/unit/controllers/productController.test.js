const ProductController = require('../../../backend/controllers/productController');
const ProductService = require('../../../backend/services/productService');
const { mockProduct } = require('../../fixtures/products');

jest.mock('../../../backend/services/productService');

describe('ProductController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      user: { uid: 'test-user-id' },
      body: {},
      params: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn(() => mockRes),
    };
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return list of products', async () => {
      const mockProducts = [mockProduct];
      ProductService.getAllProducts.mockResolvedValue(mockProducts);

      await ProductController.getAllProducts(mockReq, mockRes);

      expect(ProductService.getAllProducts).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      ProductService.getAllProducts.mockRejectedValue(error);

      await ProductController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to get products' });
    });
  });

  describe('addRecentlyViewed', () => {
    it('should add recently viewed product', async () => {
      mockReq.body = {
        productId: mockProduct.id,
        productData: mockProduct,
      };
      const mockResult = { viewCount: 1 };
      ProductService.addRecentlyViewed = jest.fn().mockResolvedValue(mockResult);

      await ProductController.addRecentlyViewed(mockReq, mockRes);

      expect(ProductService.addRecentlyViewed).toHaveBeenCalledWith(
        'test-user-id',
        mockProduct.id,
        mockProduct
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle missing productId', async () => {
      mockReq.body = {};

      await ProductController.addRecentlyViewed(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Product ID is required' });
    });

    it('should handle service errors', async () => {
      mockReq.body = { productId: '1', productData: mockProduct };
      const error = new Error('Service error');
      ProductService.addRecentlyViewed = jest.fn().mockRejectedValue(error);

      await ProductController.addRecentlyViewed(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to record view' });
    });
  });

  describe('getRecentlyViewed', () => {
    it('should return recently viewed products', async () => {
      const mockProducts = [mockRecentlyViewed];
      ProductService.getRecentlyViewed = jest.fn().mockResolvedValue(mockProducts);

      await ProductController.getRecentlyViewed(mockReq, mockRes);

      expect(ProductService.getRecentlyViewed).toHaveBeenCalledWith('test-user-id');
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      ProductService.getRecentlyViewed = jest.fn().mockRejectedValue(error);

      await ProductController.getRecentlyViewed(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to get recently viewed products',
      });
    });
  });
});
