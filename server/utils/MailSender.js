// const nodemailer = require('nodemailer');

// const MailSender = async (email, title,body) => {
//     console.log("MailSender configuration:");
//     try{
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             }
//         });
//         let info = await transporter.sendMail({
//             from: process.env.MAIL_USER,    // sender email
//             to: `${email}`,             // receiver email
//             subject: `${title}`,     // subject
//             html: `${body}`, // body
//         })
//         return info;
//     }catch (error) {
//         console.log("Mail send error:", error);  
//     }

//  }


// module.exports = MailSender;


// // const nodemailer = require('nodemailer');
// // require('dotenv').config(); // Ensure environment variables are loaded

// // const MailSender = async (email, title, body) => {
// //   try {
// //     const transporter = nodemailer.createTransport({
// //       host: process.env.MAIL_HOST,
// //       port: process.env.MAIL_PORT || 587, // Default to 587 if not set
// //       secure: false, // Set to true if using port 465
// //       auth: {
// //         user: process.env.MAIL_USER,
// //         pass: process.env.MAIL_PASS,
// //       },
// //     });

// //     const info = await transporter.sendMail({
// //       from: `"Code Support" <${process.env.MAIL_USER}>`,
// //       to: email,
// //       subject: title,
// //       html: body,
// //     });

// //     console.log("✅ Email sent:", info.messageId);
// //     return info;
// //   } catch (error) {
// //     console.error("❌ Mail send error:", error);
// //   }
// // };

// // module.exports = MailSender;



// const nodemailer = require('nodemailer');

// const MailSender = async (email, title, body) => {
//     console.log("MailSender called with:", { email, title });
//     console.log("Environment variables check:", {
//         MAIL_HOST: process.env.MAIL_HOST ? 'Set' : 'Missing',
//         MAIL_USER: process.env.MAIL_USER ? 'Set' : 'Missing',
//         MAIL_PASS: process.env.MAIL_PASS ? 'Set' : 'Missing'
//     });
    
//     try {
//         // Check if all required environment variables are present
//         if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
//             throw new Error('Missing required email configuration environment variables');
//         }

//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             port: 587, // Add explicit port
//             secure: false, // Use STARTTLS
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             },
//             // Add these for better compatibility
//             tls: {
//                 rejectUnauthorized: false
//             }
//         });

//         console.log("Transporter created successfully");

//         // Verify connection configuration
//         await transporter.verify();
//         console.log("SMTP connection verified");

//         let info = await transporter.sendMail({
//             from: `"Your App Name" <${process.env.MAIL_USER}>`, // Better sender format
//             to: email,
//             subject: title,
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2 style="color: #333;">Email Verification</h2>
//                     <p style="font-size: 16px; color: #666;">${body}</p>
//                     <p style="font-size: 14px; color: #999; margin-top: 20px;">
//                         If you didn't request this code, please ignore this email.
//                     </p>
//                 </div>
//             `
//         });

//         console.log("Email sent successfully:", info.messageId);
//         return info;
        
//     } catch (error) {
//         console.log("Mail send error details:", error);
//         throw error; // Re-throw to be caught by calling function
//     }
// };

// module.exports = MailSender;


const nodemailer = require('nodemailer');

const MailSender = async (email, title, body) => {
    console.log("MailSender configuration:");
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,    // sender email
            to: `${email}`,                 // receiver email
            subject: `${title}`,            // subject
            html: `${body}`,                // body
        });
        
        console.log("EMAIL sent successfully", info);
        return info;
    } catch (error) {
        console.log("Mail send error:", error);
        throw error; // This is important - throw the error so it can be caught by the calling function
    }
};

module.exports = MailSender;