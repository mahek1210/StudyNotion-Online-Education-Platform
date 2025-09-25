const nodemailer = require("nodemailer");

const MailSender = async (email, title, body) => {
    console.log("MailSender configuration:");
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT, // take from .env
            secure: process.env.MAIL_PORT == 465, // true for port 465, false for others
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body,
        });

        console.log("EMAIL sent successfully", info.messageId);
        return info;
    } catch (error) {
        console.log("Mail send error:", error.message);
        throw error;
    }
};

module.exports = MailSender;



// const nodemailer = require('nodemailer');

// const MailSender = async (email, title, body) => {
//     console.log("MailSender configuration:");
//     try {
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             }
//         });
        
//         let info = await transporter.sendMail({
//             from: process.env.MAIL_USER,    // sender email
//             to: `${email}`,                 // receiver email
//             subject: `${title}`,            // subject
//             html: `${body}`,                // body
//         });
        
//         console.log("EMAIL sent successfully", info);
//         return info;
//     } catch (error) {
//         console.log("Mail send error:", error);
//         throw error; // This is important - throw the error so it can be caught by the calling function
//     }
// };

// module.exports = MailSender;