import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Download, CreditCard, PieChart } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './theme.css';
import './style.css';

// Initialize Stripe with a placeholder key (Replace with your actual publishable key)
const stripePromise = loadStripe('pk_test_placeholder');

const CheckoutForm = ({ apiBaseUrl }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setStatus('processing');
    const res = await fetch(`${apiBaseUrl}/api/create-payment-intent`, {
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
        <CreditCard size={18} /> {status === 'processing' ? 'Processing...' : 'Checkout Now'}
      </button>
    </form>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <header className="header">
        <div>
          <h1>Treat Dashboard</h1>
          <p className="text-muted">Manage your rewards and payments</p>
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={generatePDF}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="card">
          <h3>Revenue Overview</h3>
          <div className="chart-container">
            {!loading && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="side-panel">
          <div className="card stat-card">
            <PieChart size={32} color="#6366f1" />
            <div className="stat-value">$14,860</div>
            <div className="text-muted">Total Sales</div>
          </div>
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3>Quick Payment</h3>
            <p className="text-muted">Securely process new treat orders.</p>
            <Elements stripe={stripePromise}>
              <CheckoutForm apiBaseUrl={API_BASE_URL} />
            </Elements>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;