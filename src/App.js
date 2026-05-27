s import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Download, CreditCard, Layout, Zap, Settings } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './theme.css';
import './style.css';

// Initialize Stripe with a placeholder key (Replace with your actual publishable key)
const stripePromise = loadStripe('pk_test_placeholder');

const CheckoutForm = ({ apiBaseUrl, type = 'payment' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setStatus('processing');
    const endpoint = type === 'subscription' ? '/api/create-subscription' : '/api/create-payment-intent';
    const res = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2000 }),
    });
    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (result.error) {
      alert(result.error.message);
      setStatus('error');
    } else {
      alert('Treat Order Successful!');
      setStatus('success');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement className="card-input" />
      <button className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'processing'}>
        <CreditCard size={18} /> 
        {status === 'processing' ? 'Processing...' : type === 'subscription' ? 'Start Subscription' : 'Pay Now'}
      </button>
    </form>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dynamically use the hosting IP for API calls
  const API_BASE_URL = useMemo(() => 
    process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`, 
  []);

  useEffect(() => {
    // Fetch analytics from backend
    fetch(`${API_BASE_URL}/api/analytics`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Treat App - Sales Report', 14, 15);
    const tableData = data.map(item => [item.name, `$${item.sales}`]);
    doc.autoTable({
      head: [['Month', 'Revenue']],
      body: tableData,
      startY: 20,
    });
    doc.save('report.pdf');
  };

  return (
    <div className="app-container">
      <nav className="nav-menu">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Layout size={20} /> Dashboard
        </div>
        <div className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
          <CreditCard size={20} /> Payments
        </div>
        <div className={`nav-item ${activeTab === 'subscription' ? 'active' : ''}`} onClick={() => setActiveTab('subscription')}>
          <Zap size={20} /> Subscription
        </div>
      </nav>

      {activeTab === 'dashboard' && (
        <div className="view-content">
          <header className="header">
            <h1>Insights</h1>
            <button className="btn" onClick={generatePDF}><Download size={18} /> Export PDF</button>
          </header>
          <section className="card">
            <h3>Revenue Performance</h3>
            <div className="chart-container">
              {!loading && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#fff'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#fff'}} />
                    <Tooltip contentStyle={{background: '#1e3a8a', border: '1px solid #fff'}} />
                    <Line type="monotone" dataKey="sales" stroke="#fff" strokeWidth={3} dot={{ r: 6, fill: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="view-content" style={{maxWidth: '600px', margin: '0 auto'}}>
          <h1>Quick Payout</h1>
          <p className="text-muted">Directly send funds to your connected account (Stripe/Chime).</p>
          <section className="card">
            <Elements stripe={stripePromise}>
              <CheckoutForm apiBaseUrl={API_BASE_URL} type="payment" />
            </Elements>
          </section>
        </div>
      )}

      {activeTab === 'subscription' && (
        <div className="view-content" style={{maxWidth: '600px', margin: '0 auto'}}>
          <h1>Treat Premium</h1>
          <p className="text-muted">Subscribe for advanced analytics and automated payouts.</p>
          <section className="card">
            <div style={{marginBottom: '1.5rem'}}>
              <h2 style={{margin: 0}}>$29.99 / mo</h2>
              <ul style={{paddingLeft: '1.2rem', marginTop: '0.5rem'}}>
                <li>Unlimited exports</li>
                <li>Real-time Stripe sync</li>
                <li>Priority support</li>
              </ul>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm apiBaseUrl={API_BASE_URL} type="subscription" />
            </Elements>
          </section>
        </div>
      )}
    </div>
  );
};

export default App;