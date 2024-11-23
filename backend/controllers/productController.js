// backend/controllers/productController.js
const ProductService = require('../services/productService');

class ProductController {
    static async getAllProducts(req, res) {
        try {
            const products = mockProducts;
            res.json(products);
        } catch (error) {
            console.error('Error getting products:', error);
            res.status(500).json({ error: 'Failed to get products' });
        }
    }

    static async addRecentlyViewed(req, res) {
        try {
            const userId = req.user.uid;
            const { productId, productData } = req.body;

            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            const result = await ProductService.addRecentlyViewed(userId, productId, productData);
            res.json(result);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to record view' });
        }
    }

    static async getRecentlyViewed(req, res) {
        try {
            const userId = req.user.uid;
            const products = await ProductService.getRecentlyViewed(userId);
            res.json(products);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to get recently viewed products' });
        }
    }
}

module.exports = ProductController;