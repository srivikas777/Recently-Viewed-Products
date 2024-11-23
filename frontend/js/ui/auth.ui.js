// frontend/js/ui/auth.ui.js
export const authUI = {
    switchTab(tab) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const errorMessage = document.getElementById('error-message');

        errorMessage.textContent = '';

        if (tab === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
        }
    },

    updateUI(user) {
        const loginSection = document.getElementById('login-section');
        const userInfo = document.getElementById('user-info');
        const productsSection = document.getElementById('products-section');
        const userEmail = document.getElementById('user-email');
        const navTabs = document.querySelector('.nav-tabs');

        if (user) {
            loginSection.style.display = 'none';
            userInfo.style.display = 'flex';
            productsSection.style.display = 'block';
            navTabs.style.display = 'flex';
            userEmail.textContent = `Welcome, ${user.email}`;
        } else {
            loginSection.style.display = 'block';
            userInfo.style.display = 'none';
            productsSection.style.display = 'none';
            navTabs.style.display = 'none';
            userEmail.textContent = '';
        }
    },

    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
    }
};
