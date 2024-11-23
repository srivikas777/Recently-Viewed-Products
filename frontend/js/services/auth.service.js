// frontend/js/services/auth.service.js
import { auth } from '../config/firebase.js';

export const authService = {
    async register(email, password) {
        return await auth.createUserWithEmailAndPassword(email, password);
    },

    async login(email, password) {
        return await auth.signInWithEmailAndPassword(email, password);
    },

    logout() {
        return auth.signOut();
    },

    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    },

    async getCurrentUserToken() {
        const user = auth.currentUser;
        return user ? await user.getIdToken() : null;
    }
};
