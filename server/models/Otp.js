const mongoose = require('mongoose');
const MailSender = require("../utils/MailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");


const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },
});

async function sendVerificationMail(email, otp) {
    try {
       const mailResponse = await MailSender(email, 'OTP for Verification', emailTemplate(otp));
       console.log("EMAIL sent successfully",mailResponse);

    } catch (err) {
        console.log("error when sent mail",err);
        throw err;
    }
}

OtpSchema.pre('save', async function (next) {
    await sendVerificationMail(this.email, this.otp);
    next();
}
); 


module.exports = mongoose.model('OTP', OtpSchema);