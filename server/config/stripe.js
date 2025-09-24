// config/stripe.js
const Stripe = require("stripe");
require("dotenv").config();

// Use Stripe secret key (backend only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
