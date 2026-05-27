import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { theme } from './theme';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY'); 

const CheckoutForm = ({ onSubscriptionSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    // In a real application, you would send a request to your backend here
    // to create a PaymentIntent or a Stripe Checkout Session.
    // For this example, we'll simulate a successful payment.
    console.log("Simulating payment submission to backend...");
    setTimeout(() => {
      console.log("Payment simulated successfully!");
      onSubscriptionSuccess(); // Call the callback to update subscription status
      setLoading(false);
    }, 2000);

    // Example of how you might confirm a card payment if you had a clientSecret from your backend:
    // const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: elements.getElement(CardElement),
    //   },
    // });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: `1px solid ${theme.colors.accentBlue}`, borderRadius: theme.borderRadius, backgroundColor: theme.colors.pureWhite }}>
      <h4 style={{ color: theme.colors.textDark, marginBottom: '15px' }}>Subscribe for AI Reports</h4>
      <CardElement style={{ base: { fontSize: '16px' } }} /> {/* Stripe's secure card input */}
      {error && <div style={{ color: theme.colors.errorRed, marginTop: '10px' }}>{error}</div>}
      <button type="submit" disabled={!stripe || loading} style={{ ...inputStyle, marginTop: '20px', backgroundColor: theme.colors.leafGreen, color: theme.colors.pureWhite, cursor: 'pointer' }}>
        {loading ? 'Processing...' : 'Pay $5/month'}
      </button>
    </form>
  );
};

const StripePaymentForm = ({ onSubscriptionSuccess }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm onSubscriptionSuccess={onSubscriptionSuccess} />
  </Elements>
);

const inputStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #E0E0E0',
  fontSize: '1rem',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box'
};

export default StripePaymentForm;