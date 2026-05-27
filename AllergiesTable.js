import React, { useState } from 'react';
import { theme } from './src/theme';
import { Edit2, Trash2, Check, X, Plus } from 'lucide-react';

const AllergiesTable = ({ allergies, setAllergies }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editSubstance, setEditSubstance] = useState('');
  const [editReaction, setEditReaction] = useState('');
  const [editSeverity, setEditSeverity] = useState('Moderate');
  
  const [newSubstance, setNewSubstance] = useState('');
  const [newReaction, setNewReaction] = useState('');
  const [newSeverity, setNewSeverity] = useState('Moderate');

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Severe': return { backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2' };
      case 'Moderate': return { backgroundColor: '#FFF3E0', color: '#EF6C00', border: '1px solid #FFE0B2' };
      case 'Low': return { backgroundColor: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9' };
      default: return { backgroundColor: '#F5F5F5', color: '#616161', border: '1px solid #E0E0E0' };
    }
  };

  const handleAdd = () => {
    if (!newSubstance) return;
    setAllergies([...allergies, { substance: newSubstance, reaction: newReaction, severity: newSeverity }]);
    setNewSubstance('');
    setNewReaction('');
    setNewSeverity('Moderate');
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditSubstance(allergies[index].substance);
    setEditReaction(allergies[index].reaction);
    setEditSeverity(allergies[index].severity || 'Moderate');
  };

  const handleSaveEdit = (index) => {
    const updated = [...allergies];
    updated[index] = { substance: editSubstance, reaction: editReaction, severity: editSeverity };
    setAllergies(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this allergy?")) {
      const updated = allergies.filter((_, i) => i !== index);
      setAllergies(updated);
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: theme.borderRadius, 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
    }}>
      <h3 style={{ color: theme.colors.leafGreen, marginBottom: '15px' }}>Known Allergies</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          placeholder="New Substance"
          value={newSubstance}
          onChange={(e) => setNewSubstance(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
        />
        <input
          placeholder="Reaction"
          value={newReaction}
          onChange={(e) => setNewReaction(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
        />
        <select
          value={newSeverity}
          onChange={(e) => setNewSeverity(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
        >
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
        <button onClick={handleAdd} style={{ background: theme.colors.leafGreen, border: 'none', color: 'white', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
      </div>

      {allergies.length > 0 && (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.colors.primaryBlue}` }}>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Substance / Allergen</th>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Reaction</th>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Severity</th>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allergies.map((allergy, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: 'bold' }}>
                  {editingIndex === index ? (
                    <input value={editSubstance} onChange={(e) => setEditSubstance(e.target.value)} style={{ width: '100%' }} />
                  ) : allergy.substance}
                </td>
                <td style={{ padding: '12px 10px', color: '#777' }}>
                  {editingIndex === index ? (
                    <input value={editReaction} onChange={(e) => setEditReaction(e.target.value)} style={{ width: '100%' }} />
                  ) : allergy.reaction}
                </td>
                <td style={{ padding: '12px 10px' }}>
                  {editingIndex === index ? (
                    <select value={editSeverity} onChange={(e) => setEditSeverity(e.target.value)}>
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                  ) : (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      ...getSeverityStyle(allergy.severity || 'Moderate')
                    }}>
                      {allergy.severity || 'Moderate'}
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                  {editingIndex === index ? (
                    <>
                      <Check size={18} color={theme.colors.leafGreen} style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => handleSaveEdit(index)} />
                      <X size={18} color={theme.colors.errorRed} style={{ cursor: 'pointer' }} onClick={() => setEditingIndex(null)} />
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} color={theme.colors.accentBlue} style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => handleStartEdit(index)} />
                      <Trash2 size={18} color={theme.colors.errorRed} style={{ cursor: 'pointer' }} onClick={() => handleDelete(index)} />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <p style={{ marginTop: '15px', fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
        Source: MyChart/Epic Master File Import
      </p>
    </div>
  );
};

export default AllergiesTable;