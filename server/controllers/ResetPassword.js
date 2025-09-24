const User = require('../models/User.js');
const MailSender = require('../utils/MailSender.js');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// resetPasswordToken , forgat password
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        const token = crypto.randomUUID();

        const updateDetails = await User.findOneAndUpdate({
            email: email
        }, {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000
        },
        {
            new: true
        });

        const url = `https://studynotion-online-education-platform.onrender.com/update-password/${token}`;

        // Create email body with the reset link
        const emailBody = `
            <h1>Password Reset Request</h1>
            <p>Hello ${updateDetails.firstName},</p>
            <p>Please click on the link below to reset your password:</p>
            <a href="${url}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        await MailSender(
            email,
            'Password Reset Request',
            emailBody
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

//resetPassword
exports.resetPassword = async (req, res) => {
    try {
        console.log(req.body);
        const { token , password, confirmPassword } = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password do not match'
            });
        }

        const userDetails = await User.findOne({ resetPasswordToken: token });

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token'
            });
        }
       
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Token expired'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { resetPasswordToken: token },
            {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
