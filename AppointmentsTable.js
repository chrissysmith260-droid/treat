import React from 'react';
import { theme } from './src/theme';

const AppointmentsTable = ({ appointments }) => {
  if (!appointments || appointments.length === 0) return null;

  return (
    <div style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: theme.borderRadius, 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
    }}>
      <h3 style={{ color: theme.colors.leafGreen, marginBottom: '15px' }}>Past Appointment History</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.colors.primaryBlue}` }}>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Date</th>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Visit Type</th>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '12px 10px', color: theme.colors.textDark }}>{appt.date}</td>
                <td style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: 'bold' }}>{appt.type}</td>
                <td style={{ padding: '12px 10px', color: '#777' }}>{appt.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: '15px', fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
        Source: MyChart/Epic Master File Import
      </p>
    </div>
  );
};

export default AppointmentsTable;