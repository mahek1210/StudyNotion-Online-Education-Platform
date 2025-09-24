// // Import the required modules
// const express = require("express")
// const router = express.Router()
// const {
//   capturePayment,
//   // verifySignature,
//   verifyPayment,
//   sendPaymentSuccessEmail,
// } = require("../controllers/payments")
// const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
// router.post("/capturePayment", auth, isStudent, capturePayment)
// router.post("/verifyPayment", auth, isStudent, verifyPayment)
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isStudent,
//   sendPaymentSuccessEmail
// )
// // router.post("/verifySignature", verifySignature)

// module.exports = router



// Import the required modules
const express = require("express");
const router = express.Router();

const {
  createPaymentIntent,        // Stripe: create a PaymentIntent
  confirmPaymentAndEnroll,    // Stripe: confirm + enroll
  sendPaymentSuccessEmail,    // Send success email
} = require("../controllers/payments.js");

const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth.js");

// Create a new PaymentIntent
router.post("/create-payment-intent", auth, isStudent, createPaymentIntent);

// Confirm payment and enroll student
router.post("/confirm-payment", auth, isStudent, confirmPaymentAndEnroll);

// Send success email
router.post("/send-payment-success-email", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;
