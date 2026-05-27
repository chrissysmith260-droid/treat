import React from 'react';
import { theme } from './theme';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const SuccessPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: theme.borderRadius, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <CheckCircle size={64} color={theme.colors.leafGreen} style={{ marginBottom: '20px' }} />
        <h2 style={{ color: theme.colors.textDark, marginBottom: '10px' }}>Payment Successful!</h2>
        <p style={{ color: '#666', marginBottom: '30px', maxWidth: '300px' }}>
          Thank you for subscribing. Your AI Medical Report Compiler is now unlocked and ready to use.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            margin: '0 auto',
            padding: '12px 24px', 
            backgroundColor: theme.colors.accentBlue, 
            color: 'white', 
            border: 'none', 
            borderRadius: '25px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          <ArrowLeft size={18} /> Return to App
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;