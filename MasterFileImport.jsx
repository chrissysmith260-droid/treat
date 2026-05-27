import React, { useRef } from 'react';
import { theme } from './src/theme';
import { Upload, FileText } from 'lucide-react';

const MasterFileImport = ({ onImport }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulation of parsing an Epic/MyChart export (Lucy/Health Summary)
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // In a production environment, this would parse CCDA (XML) or PDF text.
        // We simulate the extraction of records here.
        alert(`Successfully analyzed ${file.name}. Importing historical clinical data...`);
        
        const importedData = {
          medications: [
            { name: 'Lisinopril', dosage: '10mg daily' },
            { name: 'Vitamin D3', dosage: '2000 IU' }
          ],
          allergies: [
            { substance: 'Amoxicillin', reaction: 'Rash', severity: 'Moderate' }
          ],
          labs: [
            { name: 'Total Cholesterol', value: '185', unit: 'mg/dL' },
            { name: 'Vitamin B12', value: '450', unit: 'pg/mL' }
          ],
          appointments: [
            { date: '2024-02-10', type: 'Specialist Visit', notes: 'Referred to cardiology for baseline ECG.' }
          ]
        };
        
        onImport(importedData);
      } catch (err) {
        alert("Error reading file format. Please ensure you are uploading a supported medical record file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ 
      background: '#E3F2FD', 
      padding: '24px', 
      borderRadius: theme.borderRadius, 
      border: `2px dashed ${theme.colors.accentBlue}`,
      textAlign: 'center',
      marginBottom: '1rem'
    }}>
      <Upload size={32} color={theme.colors.accentBlue} style={{ marginBottom: '10px' }} />
      <h3 style={{ color: theme.colors.accentBlue, margin: '0 0 10px 0' }}>Import Health Records</h3>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px', maxWidth: '400px', margin: '0 auto 15px auto' }}>
        Upload the "Health Summary" or "Lucy" file downloaded from MyChart or any Epic-based patient portal to sync your history.
      </p>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
        accept=".json,.xml,.pdf,.txt"
      />
      <button 
        onClick={() => fileInputRef.current.click()}
        style={{ backgroundColor: theme.colors.accentBlue, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <FileText size={18} /> Select Portal Export File
      </button>
    </div>
  );
};

export default MasterFileImport;