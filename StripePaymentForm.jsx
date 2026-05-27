import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { theme } from './src/theme';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder'); 

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

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to initiate subscription.');

      const { clientSecret } = await response.json();

      // Confirm the card payment via Stripe
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (confirmError) {
        setError(confirmError.message);
      } else {
        onSubscriptionSuccess();
      }
    } catch (err) {
      setError("Failed to reach payment server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: `1px solid ${theme.colors.accentBlue}`, borderRadius: theme.borderRadius, backgroundColor: '#CCE5FF' }}>
      <h4 style={{ color: theme.colors.textDark, marginBottom: '15px' }}>Subscribe for AI Reports</h4>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} /> {/* Stripe's secure card input */}
      {error && <div style={{ color: theme.colors.errorRed, marginTop: '10px' }}>{error}</div>}
      <button type="submit" disabled={!stripe || loading} style={{ ...inputStyle, marginTop: '20px', backgroundColor: theme.colors.leafGreen, color: '#FFFFFF', textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000', cursor: 'pointer' }}>
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