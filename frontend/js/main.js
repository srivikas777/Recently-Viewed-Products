// js/main.js
import { authService } from './services/auth.service.js';
import { authUI } from './ui/auth.ui.js';
import { productUI } from './ui/product.ui.js';

// Set up window-scoped functions for HTML onclick handlers
window.switchTab = authUI.switchTab.bind(authUI);
window.login = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        await authService.login(email, password);
        authUI.showError('');
    } catch (error) {
        console.error('Login error:', error);
        authUI.showError(error.message);
    }
};

window.register = async () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
        await authService.register(email, password);
        authUI.showError('');
    } catch (error) {
        console.error('Registration error:', error);
        authUI.showError(error.message);
    }
};

window.logout = () => authService.logout();
window.switchSection = productUI.switchSection.bind(productUI);
window.viewProduct = productUI.showProductModal.bind(productUI);
window.closeProductModal = productUI.closeProductModal.bind(productUI);

// Set up modal click handler
window.onclick = (event) => {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        productUI.closeProductModal();
    }
};

// Initialize app
function initializeApp() {
    // Set up authentication state listener
    authService.onAuthStateChanged((user) => {
        authUI.updateUI(user);
        if (user) {
            productUI.displayProducts();
            productUI.loadRecentlyViewed();
        }
    });
}

// Start the app
initializeApp();