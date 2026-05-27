import React, { useState } from 'react';
import { theme } from './src/theme';

const SymptomLogger = ({ symptoms, setSymptoms }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'new',
    date: new Date().toISOString().split('T')[0],
    mood: 'Neutral',
    severity: 'Moderate',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Severe': return { backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2' };
      case 'Moderate': return { backgroundColor: '#FFF3E0', color: '#EF6C00', border: '1px solid #FFE0B2' };
      case 'Low': return { backgroundColor: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9' };
      default: return { backgroundColor: '#F5F5F5', color: '#616161', border: '1px solid #E0E0E0' };
    }
  };

  const filteredSymptoms = symptoms.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStart = !startDate || item.date >= startDate;
    const matchesEnd = !endDate || item.date <= endDate;
    return matchesSearch && matchesStart && matchesEnd;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setSymptoms([formData, ...symptoms]);
    setFormData({
      name: '',
      type: 'new',
      date: new Date().toISOString().split('T')[0],
      mood: 'Neutral',
      severity: 'Moderate',
      notes: ''
    });
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: theme.borderRadius, 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
    }}>
      <h3 style={{ color: theme.colors.accentBlue }}>Symptom Log</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Symptom name (e.g. Brain Fog, Fatigue)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ ...inputStyle, flex: 1 }}
          >
            <option value="new">New Symptom</option>
            <option value="old">Old Symptom</option>
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            style={{ ...inputStyle, flex: 1 }}
          />
          <select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            style={{ ...inputStyle, flex: 1 }}
          >
            <option value="Low">Low Severity</option>
            <option value="Moderate">Moderate Severity</option>
            <option value="Severe">Severe Severity</option>
          </select>
          <select
            value={formData.mood}
            onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
            style={{ ...inputStyle, flex: 1 }}
          >
            <option value="Happy">Mood: Happy 😊</option>
            <option value="Good">Mood: Good 🙂</option>
            <option value="Neutral">Mood: Neutral 😐</option>
            <option value="Sad">Mood: Sad 😔</option>
            <option value="Anxious">Mood: Anxious 😰</option>
            <option value="Angry">Mood: Angry 😠</option>
          </select>
        </div>
        <textarea
          placeholder="Describe how you're feeling..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
        />
        <button type="submit" style={{
          backgroundColor: theme.colors.accentBlue,
          color: 'white',
          border: 'none',
          padding: '12px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'opacity 0.2s'
        }}>
          Log Symptom
        </button>
      </form>

      <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, width: '100%' }}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: '#777', display: 'block', marginBottom: '4px' }}>From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ ...inputStyle, width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: '#777', display: 'block', marginBottom: '4px' }}>To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ ...inputStyle, width: '100%', padding: '8px' }}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              style={{ alignSelf: 'flex-end', padding: '8px', fontSize: '0.7rem', color: theme.colors.accentBlue, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {filteredSymptoms.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', fontSize: '0.9rem' }}>
            {symptoms.length === 0 ? "No symptoms recorded yet." : "No matching symptoms found."}
          </p>
        ) : (
          filteredSymptoms.map((item, idx) => (
            <div key={idx} style={{ 
              padding: '12px 0', 
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500', color: theme.colors.textDark }}>{item.name}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    ...getSeverityStyle(item.severity || 'Moderate')
                  }}>
                    {item.severity || 'Moderate'}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: item.type === 'new' ? theme.colors.accentBlue : '#888',
                    background: item.type === 'new' ? theme.colors.primaryBlue : '#f5f5f5',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa' }}>
                <span>{item.date}</span>
                <span>Mood: {item.mood || 'Neutral'}</span>
              </div>
              {item.notes && <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{item.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #E0E0E0',
  fontSize: '1rem',
  fontFamily: 'inherit'
};

export default SymptomLogger;