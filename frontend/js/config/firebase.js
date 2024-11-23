// frontend/js/config/firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyBzcLVcFMGOkZbpidN72abnUwxW2iciBCQ",
    authDomain: "recently-viewed-products-fbb0d.firebaseapp.com",
    projectId: "recently-viewed-products-fbb0d",
    storageBucket: "recently-viewed-products-fbb0d.firebasestorage.app",
    messagingSenderId: "749249253376",
    appId: "1:749249253376:web:8ae2caf6290b12a12fc8e5",
    measurementId: "G-CXBVWHYD40"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
});