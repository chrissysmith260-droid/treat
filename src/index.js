const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Mock Data for Dashboard
const analyticsData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
];

// Endpoint: AI Report Generation (Proxy to Gemini)
app.post('/api/ai/generate-report', async (req, res) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint: Analytics
app.get('/api/analytics', (req, res) => {
  res.json(analyticsData);
});

// Endpoint: Create Stripe Subscription
// Note: For Chime payouts, ensure your Chime account is linked in Stripe Dashboard > Payouts
app.post('/api/create-subscription', async (req, res) => {
  try {
    // In a real app, you would create a Stripe Product and Price first
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2999,
      currency: 'usd',
      setup_future_usage: 'off_session',
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Endpoint: Create Stripe Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));