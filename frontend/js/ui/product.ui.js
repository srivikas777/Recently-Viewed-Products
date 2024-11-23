// js/ui/product.ui.js
import { productService } from '../services/product.service.js';
import { auth } from '../config/firebase.js';

export const productUI = {
    products: [],

    displayProducts() {
        const productsGrid = document.getElementById('products-grid');
        this.products = productService.generateProducts(30);

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card" onclick="window.viewProduct(${product.id})">
                <img src="https://picsum.photos/seed/${product.id}/400/300" class="product-image" alt="${product.name}">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        `).join('');
    },

    displayRecentlyViewed(recentProducts) {
        const container = document.getElementById('products');
        
        if (!recentProducts || recentProducts.length === 0) {
            container.innerHTML = '<p>No recently viewed products</p>';
            return;
        }
    
        container.innerHTML = recentProducts.map(item => {
            const displayData = item.productData || item.productDetails || {};
            return `
                <div class="product-card">
                    <img src="${displayData.image}" 
                         class="product-image" 
                         alt="${displayData.name}"
                         onerror="this.src='https://picsum.photos/seed/${item.productId}/400/300'"
                    >
                    <div class="product-name">${displayData.name}</div>
                    <div class="product-price">$${displayData.price.toFixed(2)}</div>
                    <div class="view-count">Viewed ${item.viewCount || 1} time(s)</div>
                    <div class="viewed-time">Last viewed: ${new Date(item.lastViewed).toLocaleString()}</div>
                    <button onclick="window.viewProduct(${item.productId})" class="view-button">
                        View Again
                    </button>
                </div>
            `;
        }).join('');
    },

    async showProductModal(productId) {
        if (!auth.currentUser) {
            alert('Please login to view product details');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('productModal');
        const productDetails = document.getElementById('productDetails');
        
        productDetails.innerHTML = `
            <div class="product-details">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <p class="product-description">${product.description}</p>
                    <div id="view-data-container">
                        <div class="loading-indicator">
                            <div class="spinner"></div>
                            <span>Loading view data...</span>
                        </div>
                    </div>
                    <div id="timestamp-container"></div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';

        try {
            const viewData = await productService.recordProductView(productId, {
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image
            });
            
            const viewDataContainer = document.getElementById('view-data-container');
            const timestampContainer = document.getElementById('timestamp-container');
            
            if (viewData.viewCount !== undefined) {
                viewDataContainer.innerHTML = `
                    <div class="view-count">
                        <strong>Views:</strong> ${viewData.viewCount} ${viewData.viewCount === 1 ? 'time' : 'times'}
                    </div>
                `;
                
                timestampContainer.innerHTML = `
                    <div class="view-timestamp">
                        Last viewed: ${new Date(viewData.lastViewed).toLocaleString()}
                    </div>
                `;
            } else {
                viewDataContainer.innerHTML = '<div class="view-count">First view!</div>';
            }
        } catch (error) {
            console.error('Error recording view:', error);
            document.getElementById('view-data-container').innerHTML = `
                <div class="error-message">
                    Error loading view data. Please try again.
                </div>
            `;
        }
    },

    closeProductModal() {
        const modal = document.getElementById('productModal');
        modal.style.display = 'none';
    },

    switchSection(section) {
        const productsSection = document.getElementById('products-section');
        const recentlyViewedSection = document.getElementById('recently-viewed-section');
        const allProductsTab = document.querySelector('[onclick="window.switchSection(\'products\')"]');
        const recentlyViewedTab = document.querySelector('[onclick="window.switchSection(\'recently-viewed\')"]');
    
        allProductsTab.classList.remove('active');
        recentlyViewedTab.classList.remove('active');
    
        if (section === 'products') {
            productsSection.style.display = 'block';
            recentlyViewedSection.style.display = 'none';
            allProductsTab.classList.add('active');
            this.displayProducts();
        } else {
            productsSection.style.display = 'none';
            recentlyViewedSection.style.display = 'block';
            recentlyViewedTab.classList.add('active');
            this.loadRecentlyViewed();
        }
    },

    async loadRecentlyViewed() {
        if (!auth.currentUser) return;
    
        try {
            console.log('Loading recently viewed products...');
            const recentProducts = await productService.getRecentlyViewed();
            console.log('Loaded recently viewed products:', recentProducts);
            
            document.getElementById('recently-viewed-section').style.display = 'block';
            document.getElementById('products-section').style.display = 'none';
    
            this.displayRecentlyViewed(recentProducts);
        } catch (error) {
            console.error('Error loading recently viewed products:', error);
            document.getElementById('products').innerHTML = 
                '<p class="error-message">Error loading recently viewed products</p>';
        }
    }
};