import React, { useState } from 'react';
import { theme } from './src/theme';

const VitalsTracker = ({ onLogVitals }) => {
  const [vitals, setVitals] = useState({ hr: '', bp: '', glucose: '', o2: '' });
  const [suggestion, setSuggestion] = useState('');

  const checkVitals = (name, value) => {
    if (name === 'glucose' && value !== '' && value < 70) {
      setSuggestion("Your sugar is low. Have you eaten? Consider adding complex carbs or a small protein snack.");
    } else if (name === 'bp' && value.includes('/')) {
      const [sys] = value.split('/').map(Number);
      if (sys > 140 || sys < 90) {
        setSuggestion("Blood pressure fluctuation detected. Try stimulating the vagus nerve: splash cold water on your wrists, back of neck, or chest to help reset your nervous system.");
      }
    } else {
      setSuggestion('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals({ ...vitals, [name]: value });
    checkVitals(name, value);
  };

  const handleLog = () => {
    if (vitals.hr || vitals.bp || vitals.glucose || vitals.o2) {
      onLogVitals({
        ...vitals,
        timestamp: new Date().toLocaleString()
      });
      setVitals({ hr: '', bp: '', glucose: '', o2: '' });
      alert("Vitals logged to history.");
    }
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: theme.colors.accentBlue }}>Daily Vitals</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        <input name="o2" placeholder="Oxygen %" onChange={handleChange} style={inputStyle} />
        <input name="hr" placeholder="Heart Rate (BPM)" onChange={handleChange} style={inputStyle} />
        <input name="bp" placeholder="Blood Pressure (e.g. 120/80)" onChange={handleChange} style={inputStyle} />
        <input name="glucose" placeholder="Glucose (mg/dL)" onChange={handleChange} style={inputStyle} />
      </div>

      <button 
        onClick={handleLog}
        style={{ 
          marginTop: '10px', 
          width: '100%', 
          padding: '10px', 
          backgroundColor: theme.colors.accentBlue, 
          color: 'white', 
          border: 'none', 
          borderRadius: '10px' 
        }}>Log Today's Vitals</button>

      {suggestion && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: theme.colors.primaryBlue, borderRadius: '10px', borderLeft: `5px solid ${theme.colors.leafGreen}` }}>
          <strong>Tip:</strong> {suggestion}
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#999' }}>Unlock AI Medical Compiler for $5/mo</p>
        <a 
          href="https://buy.stripe.com/3cI14o0yYghX9gmci11B600" 
          style={{ textDecoration: 'none', color: 'white', backgroundColor: '#81C784', padding: '10px 20px', borderRadius: '20px', display: 'inline-block' }}
        >
          Subscribe via Stripe
        </a>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #E0E0E0',
  fontSize: '1rem'
};

export default VitalsTracker;