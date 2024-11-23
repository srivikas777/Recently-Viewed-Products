// backend/config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

module.exports = { sendEmail };