// backend/routes/v1/productRoutes.js
const router = require('express').Router();
const { verifyToken } = require('../../middlewares/auth');
const ProductController = require('../../controllers/productController');

router.get('/products/recent', verifyToken, ProductController.getRecentlyViewed);
router.post('/products/view', verifyToken, ProductController.addRecentlyViewed);
router.get('/products', ProductController.getAllProducts);

module.exports = router;