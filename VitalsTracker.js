import React, { useState } from 'react';

const VitalsTracker = () => {
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

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: '#90CAF9' }}>Daily Vitals</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        <input name="o2" placeholder="Oxygen %" onChange={handleChange} style={inputStyle} />
        <input name="hr" placeholder="Heart Rate (BPM)" onChange={handleChange} style={inputStyle} />
        <input name="bp" placeholder="Blood Pressure (e.g. 120/80)" onChange={handleChange} style={inputStyle} />
        <input name="glucose" placeholder="Glucose (mg/dL)" onChange={handleChange} style={inputStyle} />
      </div>

      {suggestion && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#E3F2FD', borderRadius: '10px', borderLeft: '5px solid #81C784' }}>
          <strong>Tip:</strong> {suggestion}
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#999' }}>Unlock AI Medical Compiler for $5/mo</p>
        <a 
          href="https://cash.app/$Christina-Smith-910" 
          style={{ textDecoration: 'none', color: 'white', backgroundColor: '#81C784', padding: '10px 20px', borderRadius: '20px', display: 'inline-block' }}
        >
          Subscribe via CashApp
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