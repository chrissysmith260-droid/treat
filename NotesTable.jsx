import React, { useState } from 'react';
import { theme } from './src/theme';
import { Plus, Trash2 } from 'lucide-react';

const NotesTable = ({ notes, setNotes }) => {
  const [newNote, setNewNote] = useState('');
  const iconOutline = { filter: 'drop-shadow(1px 1px 0 #000) drop-shadow(-1px 1px 0 #000) drop-shadow(1px -1px 0 #000) drop-shadow(-1px -1px 0 #000)' };

  const handleAdd = () => {
    if (!newNote.trim()) return;
    setNotes([{ text: newNote, date: new Date().toLocaleString() }, ...notes]);
    setNewNote('');
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{ background: '#CCE5FF', padding: '20px', borderRadius: theme.borderRadius, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: theme.colors.leafGreen, marginBottom: '15px' }}>General Medical Notes</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <textarea
          placeholder="Add important details, family history, or physician instructions..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={{ 
            padding: '12px', 
            borderRadius: '10px', 
            border: '1px solid #E0E0E0', 
            flex: 1, 
            backgroundColor: '#D1E9FF',
            minHeight: '60px',
            fontFamily: 'inherit'
          }}
        />
        <button onClick={handleAdd} style={{ background: theme.colors.leafGreen, border: 'none', color: 'white', textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000', borderRadius: '8px', padding: '10px', cursor: 'pointer', alignSelf: 'flex-start' }}>
          <Plus size={24} style={iconOutline} />
        </button>
      </div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {notes.map((note, idx) => (
          <div key={idx} style={{ background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #E3F2FD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>{note.date}</span>
              <Trash2 size={16} color={theme.colors.errorRed} style={{ cursor: 'pointer', ...iconOutline }} onClick={() => handleDelete(idx)} />
            </div>
            <p style={{ margin: 0, color: theme.colors.textDark, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesTable;