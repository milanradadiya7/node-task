const nodemailer = require('nodemailer');
const { randomInt } = require("crypto");


async function sendOtp(req, res) {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "30716c5f4eba45",
            pass: "2dd47595c24c6b",
        }
    });
    const { email } = req.body;
    if (!email) {
        return res.json({ error: 'Email is required' });
    };
    const otp = sendOTP(email);

    function sendOTP(email) {
        const otp = randomInt(1000, 9999);

        const mailOptions = {
            from: 'your_email@example.com',
            to: email,
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP is: ${otp}. Please use this OTP to verify your account.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            };
        });
        return otp; // Return the OTP generated
    };

    res.json({
        message: 'OTP sent successfully',
        otp
    });
};



module.exports = {
    sendOtp,
}