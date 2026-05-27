import React, { useState } from 'react';
import { theme } from './src/theme';
import { Edit2, Trash2, Check, X, Plus } from 'lucide-react';

const MedicationsTable = ({ medications, setMedications }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDosage, setEditDosage] = useState('');

  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');

  const handleAdd = () => {
    if (!newName) return;
    setMedications([...medications, { name: newName, dosage: newDosage }]);
    setNewName('');
    setNewDosage('');
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditName(medications[index].name);
    setEditDosage(medications[index].dosage);
  };

  const handleSaveEdit = (index) => {
    const updated = [...medications];
    updated[index] = { name: editName, dosage: editDosage };
    setMedications(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      const updated = medications.filter((_, i) => i !== index);
      setMedications(updated);
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: theme.borderRadius, 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
    }}>
      <h3 style={{ color: theme.colors.leafGreen, marginBottom: '15px' }}>Active Medications</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          placeholder="Medication Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
        />
        <input
          placeholder="Dosage"
          value={newDosage}
          onChange={(e) => setNewDosage(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
        />
        <button onClick={handleAdd} style={{ background: theme.colors.leafGreen, border: 'none', color: 'white', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
      </div>

      {medications.length > 0 && (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.colors.primaryBlue}` }}>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Medication Name</th>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600' }}>Dosage</th>
              <th style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '12px 10px', color: theme.colors.textDark, fontWeight: 'bold' }}>
                  {editingIndex === index ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%' }} />
                  ) : med.name}
                </td>
                <td style={{ padding: '12px 10px', color: '#777' }}>
                  {editingIndex === index ? (
                    <input value={editDosage} onChange={(e) => setEditDosage(e.target.value)} style={{ width: '100%' }} />
                  ) : med.dosage}
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

export default MedicationsTable;