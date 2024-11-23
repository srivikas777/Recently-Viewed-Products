// tests/fixtures/products.js
module.exports = {
    mockProduct: {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
      image: 'https://test.com/image.jpg',
    },
  
    mockRecentlyViewed: {
      productId: '1',
      viewCount: 1,
      firstViewed: new Date(),
      lastViewed: new Date(),
      productData: {
        name: 'Test Product',
        price: 99.99,
        description: 'Test description',
        image: 'https://test.com/image.jpg',
      },
    },
  };
  