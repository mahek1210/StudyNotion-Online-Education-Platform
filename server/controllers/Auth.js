const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp.js');
const otpGenerator = require('otp-generator');
const MailSender = require('../utils/MailSender.js');
const crypto = require("crypto");
const Profile = require('../models/Profile.js');
require('dotenv').config();


// ======================== Send OTP ========================
// exports.sendOtp = async (req, res) => {
//     try {
//         const { email } = req.body;
//         console.log(email);
//         console.log("Send OTP request received:", req.body);

//         const checkUser = await User.findOne({ email });
//         console.log("all good 1");
//         if (checkUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists with this email"
//             });
//         }
//         // console.log (error);


//         function generateOTP(length) {
//             return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
//         }
        

//         const uniqueOtp = generateOTP(6);
//         console.log("Generated OTP:", uniqueOtp);

//         const otpPayload = {
//             email: email,
//             otp: uniqueOtp,
//             createdAt: new Date(),
//             expiresAt: new Date(Date.now() + 10 * 60 * 1000) // expires in 10 minutes
//         };

//         const otpBody = await Otp.create(otpPayload);

//         // Send OTP to user's email
//         try {
//             console.log("Sending OTP email to:", email);
//             await MailSender({
//                 email: email,
//                 title: "Your OTP Code",
//                 body: `Your OTP code is: ${uniqueOtp}. It will expire in 10 minutes.`
//             });
//         } catch (mailError) {
//             console.log("Error sending OTP email:", mailError);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to send OTP email."
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "OTP sent successfully to your email."
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email received:", email);
        console.log("Send OTP request received:", req.body);

        // Validate email format
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        const checkUser = await User.findOne({ email });
        console.log("User check completed");
        
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        function generateOTP(length) {
            return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
        }

        const uniqueOtp = generateOTP(6);
        console.log("Generated OTP:", uniqueOtp);

        const otpPayload = {
            email: email,
            otp: uniqueOtp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // expires in 10 minutes
        };

        const otpBody = await Otp.create(otpPayload);
        console.log("OTP saved to database:", otpBody);

        // Send OTP to user's email
        // try {
        //     console.log("Sending OTP email to:", email);
        //     const mailResult = await MailSender(email, "Your OTP Code", `Your OTP code is: ${uniqueOtp}. It will expire in 10 minutes.`);
        //     console.log("Mail sent successfully:", mailResult.messageId);
        // } catch (mailError) {
        //     console.log("Error sending OTP email:", mailError);
        //     return res.status(500).json({
        //         success: false,
        //         message: "Failed to send OTP email. Please try again."
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email."
        });
    } catch (error) {
        console.log("Main function error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================== Sign Up ========================
exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp // fixed here: was `Otp`
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Password and Confirm Password must be same"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }

        const recentOtp = await Otp.findOne({ email, otp }).sort({ createdAt: -1 }).limit(1);
        if (!recentOtp) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: "",
            dateOfBirth: "",
            about: "",
            contactNumber: "",
        });

        const userPayload = {
            firstName,
            lastName,
            email,
            password: hashPassword,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/8.x/adventurer/svg?seed=${firstName}${lastName}`
        };

        const user = await User.create(userPayload);

        res.status(200).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================== Login ========================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered. Please sign up."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        user.password = undefined;
        user.token = token;

        res.cookie('token', token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }).status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

    console.log("Login request received:", req.body);
};


// ======================== Change Password ========================
// exports.changePassword = async (req, res) => {
//     try {
//         // const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
//         const { oldPassword, newPassword } = req.body;

//         console.log("Change Password request received:", req.body);

//         if ( !oldPassword || !newPassword ) {
//             return res.status(403).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         // if (newPassword !== confirmNewPassword) {
//         //     return res.status(403).json({
//         //         success: false,
//         //         message: "New password and confirm password must be same"
//         //     });
//         // }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid credentials"
//             });
//         }

//         const isMatch = await bcrypt.compare(oldPassword, User.password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Incorrect old password"
//             });
//         }

//         user.password = await bcrypt.hash(newPassword, 10);
//         await User.save();

//         await MailSender({
//             email: User.email,
//             title: "Password Changed",
//             body: "Your password has been changed successfully"
//         });

//         res.status(200).json({
//             success: true,
//             message: "Password changed successfully",
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log("Change Password request received:", req.body);

    if (!oldPassword || !newPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Get logged-in user's ID from JWT payload
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect old password"
      });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // OPTIONAL: Send email notification
    // await MailSender({
    //   email: user.email,
    //   title: "Password Changed",
    //   body: "Your password has been changed successfully"
    // });

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
