// backend/config/firebase.js
const admin = require('firebase-admin');
const path = require('path');

function initializeFirebase() {
    if (!admin.apps.length) {
        const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    return admin;
}

module.exports = { admin: initializeFirebase(), firestore: initializeFirebase().firestore() };