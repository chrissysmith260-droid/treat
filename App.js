import React, { useState, useEffect, useRef } from 'react';
import Mindfulness from './Mindfulness';
import VitalsTracker from './VitalsTracker';
import VitalsChart from './VitalsChart';
import SymptomLogger from './SymptomLogger';
import AIReportCompiler from './AIReportCompiler';
import LabsTable from './LabsTable';
import AppointmentsTable from './AppointmentsTable';
import MedicationsTable from './MedicationsTable';
import AllergiesTable from './AllergiesTable';
import SuccessPage from './SuccessPage';
import { theme } from './theme';
import { Leaf } from 'lucide-react';

const App = () => {
  const [isSuccessRedirect, setIsSuccessRedirect] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [labs, setLabs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [exportConfirmation, setExportConfirmation] = useState(null);
  const fileInputRef = useRef(null);
  const masterFileInputRef = useRef(null);

  // Initialize subscription state from localStorage
  const [isSubscribed, setIsSubscribed] = useState(() => {
    const saved = localStorage.getItem('treat_ai_unlocked');
    return saved === 'true';
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsSuccessRedirect(true);
      // Permanently unlock in localStorage
      setIsSubscribed(true);
      localStorage.setItem('treat_ai_unlocked', 'true');
    }
  }, []);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all logged data and reset your subscription status for testing?")) {
      setSymptoms([]);
      setVitalsHistory([]);
      setLabs([]);
      setAppointments([]);
      setMedications([]);
      setAllergies([]);
      setIsSubscribed(false);
      localStorage.removeItem('treat_ai_unlocked');
    }
  };

  const downloadData = () => {
    const data = {
      symptoms,
      vitalsHistory,
      labs,
      appointments,
      medications,
      allergies,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `treat_data_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.symptoms && data.vitalsHistory && data.labs && data.appointments && data.medications && data.allergies) {
          if (window.confirm("Importing data will replace your current logs. Continue?")) {
            setSymptoms(data.symptoms);
            setVitalsHistory(data.vitalsHistory);
            setLabs(data.labs);
            setAppointments(data.appointments);
            setMedications(data.medications);
            setAllergies(data.allergies);
            alert("Data imported successfully!");
          }
        } else {
          alert("Invalid file format. Please use a JSON file previously exported from 'treat'.");
        }
      } catch (err) {
        alert("Error reading file. Please ensure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input to allow re-importing the same file if needed
  };

  const handleMasterFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/xml");

        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
          alert("Invalid XML format. Please ensure you are uploading a CCDA (XML) export from MyChart.");
          return;
        }

        const vitalsImported = [];
        const symptomsImported = [];
        const labsImported = [];
        const appointmentsImported = [];
        const medicationsImported = [];
        const allergiesImported = [];
        const sections = xmlDoc.getElementsByTagName("section");

        for (let i = 0; i < sections.length; i++) {
          const title = sections[i].getElementsByTagName("title")[0]?.textContent?.toLowerCase() || "";
          
          // Parse Vitals
          if (title.includes("vital signs")) {
            const observations = sections[i].getElementsByTagName("observation");
            for (let k = 0; k < observations.length; k++) {
              const displayName = observations[k].getElementsByTagName("code")[0]?.getAttribute("displayName");
              const value = observations[k].getElementsByTagName("value")[0]?.getAttribute("value");
              const dateRaw = observations[k].getElementsByTagName("effectiveTime")[0]?.getAttribute("value") || 
                             observations[k].getElementsByTagName("effectiveTime")[0]?.getElementsByTagName("low")[0]?.getAttribute("value");
              if (displayName && value) vitalsImported.push({ displayName, value, dateRaw });
            }
          }

          // Parse Problems/Symptoms
          if (title.includes("problems") || title.includes("diagnoses")) {
            const observations = sections[i].getElementsByTagName("observation");
            for (let k = 0; k < observations.length; k++) {
              const name = observations[k].getElementsByTagName("value")[0]?.getAttribute("displayName");
              const dateRaw = observations[k].getElementsByTagName("effectiveTime")[0]?.getElementsByTagName("low")[0]?.getAttribute("value");
              if (name) symptomsImported.push({
                name, type: 'old', notes: 'Imported from MyChart Master File',
                date: dateRaw ? `${dateRaw.substring(0,4)}-${dateRaw.substring(4,6)}-${dateRaw.substring(6,8)}` : new Date().toISOString().split('T')[0]
              });
            }
          }

          // Parse Labs
          if (title.includes("results") || title.includes("lab")) {
            const observations = sections[i].getElementsByTagName("observation");
            for (let k = 0; k < observations.length; k++) {
              const name = observations[k].getElementsByTagName("code")[0]?.getAttribute("displayName");
              const value = observations[k].getElementsByTagName("value")[0]?.getAttribute("value");
              const unit = observations[k].getElementsByTagName("value")[0]?.getAttribute("unit");
              if (name && value) labsImported.push({ name, value, unit: unit || "" });
            }
          }

          // Parse Appointments/Encounters
          if (title.includes("encounters") || title.includes("visits") || title.includes("appointments")) {
            const entries = sections[i].getElementsByTagName("encounter");
            for (let k = 0; k < entries.length; k++) {
              const type = entries[k].getElementsByTagName("code")[0]?.getAttribute("displayName");
              const dateRaw = entries[k].getElementsByTagName("effectiveTime")[0]?.getAttribute("value") || 
                             entries[k].getElementsByTagName("effectiveTime")[0]?.getElementsByTagName("low")[0]?.getAttribute("value");
              if (dateRaw) appointmentsImported.push({
                date: `${dateRaw.substring(4,6)}/${dateRaw.substring(6,8)}/${dateRaw.substring(0,4)}`,
                type: type || "Medical Visit",
                notes: "Clinical encounter recorded in master file."
              });
            }
          }

          // Parse Medications
          if (title.includes("medication")) {
            const entries = sections[i].getElementsByTagName("substanceAdministration");
            for (let k = 0; k < entries.length; k++) {
              const name = entries[k].getElementsByTagName("manufacturedMaterial")[0]?.getElementsByTagName("code")[0]?.getAttribute("displayName") ||
                           entries[k].getElementsByTagName("code")[0]?.getAttribute("displayName");
              const dose = entries[k].getElementsByTagName("doseQuantity")[0]?.getAttribute("value");
              const unit = entries[k].getElementsByTagName("doseQuantity")[0]?.getAttribute("unit");
              if (name) medicationsImported.push({
                name,
                dosage: dose ? `${dose} ${unit || ""}` : "Consult chart for instructions"
              });
            }
          }

          // Parse Allergies
          if (title.includes("allergy") || title.includes("allergies")) {
            const observations = sections[i].getElementsByTagName("observation");
            for (let k = 0; k < observations.length; k++) {
              const substance = observations[k].getElementsByTagName("participant")[0]?.getElementsByTagName("playingEntity")[0]?.getElementsByTagName("name")[0]?.textContent ||
                                observations[k].getElementsByTagName("value")[0]?.getAttribute("displayName");
              const reaction = observations[k].getElementsByTagName("entryRelationship")[0]?.getElementsByTagName("observation")[0]?.getElementsByTagName("value")[0]?.getAttribute("displayName") || "Unknown reaction";
              if (substance) allergiesImported.push({ substance, reaction });
            }
          }
        }

        if (vitalsImported.length || symptomsImported.length || labsImported.length || appointmentsImported.length || medicationsImported.length || allergiesImported.length) {
          if (window.confirm(`Found ${vitalsImported.length} vitals, ${symptomsImported.length} medical history entries, ${labsImported.length} lab results, ${appointmentsImported.length} past appointments, ${medicationsImported.length} medications, and ${allergiesImported.length} allergies. Populate your history?`)) {
            if (vitalsImported.length) {
              const mappedVitals = vitalsImported.map(v => ({
                timestamp: v.dateRaw ? `${v.dateRaw.substring(4,6)}/${v.dateRaw.substring(6,8)}/${v.dateRaw.substring(0,4)}` : new Date().toLocaleString(),
                hr: v.displayName.toLowerCase().includes("heart rate") ? v.value : '',
                bp: v.displayName.toLowerCase().includes("blood pressure") ? v.value : '',
                glucose: v.displayName.toLowerCase().includes("glucose") ? v.value : '',
                o2: v.displayName.toLowerCase().includes("oxygen") ? v.value : ''
              }));
              setVitalsHistory(prev => [...mappedVitals, ...prev]);
            }
            if (symptomsImported.length) setSymptoms(prev => [...symptomsImported, ...prev]);
            if (labsImported.length) setLabs(prev => [...labsImported, ...prev]);
            if (appointmentsImported.length) setAppointments(prev => [...appointmentsImported, ...prev]);
            if (medicationsImported.length) setMedications(prev => [...medicationsImported, ...prev]);
            if (allergiesImported.length) setAllergies(prev => [...allergiesImported, ...prev]);
            alert("Medical history populated successfully!");
          }
        } else {
          alert("No recognizable medical data found in the Master File.");
        }
      } catch (err) {
        alert("Error parsing Master File. Please ensure it is a valid CCDA XML file.");
      }
    };
    if (file.name.toLowerCase().endsWith(".xml")) reader.readAsText(file);
    else alert("Please upload an XML file (CCDA) exported from MyChart.");
    event.target.value = '';
  };

  const downloadVitalsCSV = () => {
    if (vitalsHistory.length === 0) {
      alert("No vitals data to export.");
      return;
    }
    const headers = ["Date/Time", "BP", "HR", "Glucose", "O2%"];
    const rows = vitalsHistory.map(v => [
      `"${v.timestamp}"`,
      `"${v.bp}"`,
      `"${v.hr}"`,
      `"${v.glucose}"`,
      `"${v.o2}%"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `vitals_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportInfo = {
    json: {
      title: "Export All Data (JSON)",
      description: "This will export your entire medical log, including all symptoms and vitals history, into a structured JSON file. This is best for backing up your data.",
      action: downloadData
    },
    csv: {
      title: "Export Vitals (CSV)",
      description: "This will export only your vitals history (Oxygen, Heart Rate, BP, Glucose) into a CSV file, easily opened in spreadsheet software like Excel.",
      action: downloadVitalsCSV
    }
  };

  return (
    <div style={{ 
      backgroundColor: theme.colors.primaryBlue, 
      minHeight: '100vh', 
      fontFamily: theme.fonts.main,
      padding: '20px',
      color: theme.colors.textDark
    }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '2rem' 
      }}>
        <Leaf color={theme.colors.leafGreen} size={32} />
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 10px', 
          fontWeight: '300',
          color: theme.colors.accentBlue 
        }}>
          treat
        </h1>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '2rem' }}>
        {isSuccessRedirect ? (
          <SuccessPage />
        ) : (
          <>
            <section>
              <VitalsChart data={vitalsHistory} />
            </section>

            <section>
              <VitalsTracker onLogVitals={(v) => setVitalsHistory([v, ...vitalsHistory])} />
            </section>
            
            <section>
              <SymptomLogger symptoms={symptoms} setSymptoms={setSymptoms} />
            </section>

            <section>
              <LabsTable labs={labs} />
            </section>

            <section>
              <AppointmentsTable appointments={appointments} />
            </section>

            <section>
              <MedicationsTable medications={medications} setMedications={setMedications} />
            </section>

            <section>
              <AllergiesTable allergies={allergies} setAllergies={setAllergies} />
            </section>

            <section>
              <AIReportCompiler 
                symptoms={symptoms} 
                vitalsHistory={vitalsHistory} 
                labs={labs}
                appointments={appointments}
                medications={medications}
                allergies={allergies}
                isSubscribed={isSubscribed}
                setIsSubscribed={setIsSubscribed} 
              />
            </section>

            <section>
              <Mindfulness />
            </section>
          </>
        )}

        <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#777' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <img src="/path-to-chime-logo.svg" alt="Chime" style={{ width: '16px', height: '16px' }} />
            <p style={{ margin: 0 }}>Donations (Chime): $Christina-Smith-910 | AI Reports: via</p>
            <img src="/path-to-stripe-logo.svg" alt="Stripe" style={{ height: '14px', verticalAlign: 'middle' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1.5rem' }}>
            <button 
              onClick={() => setExportConfirmation('json')}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1px solid ${theme.colors.accentBlue}`,
                backgroundColor: 'transparent',
                color: theme.colors.accentBlue,
                cursor: 'pointer',
                fontSize: '0.75rem',
                opacity: 0.8
              }}
            >
              Download All Data (JSON)
            </button>
            <button 
              onClick={() => masterFileInputRef.current.click()}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1px solid ${theme.colors.leafGreen}`,
                backgroundColor: 'transparent',
                color: theme.colors.leafGreen,
                cursor: 'pointer',
                fontSize: '0.75rem',
                opacity: 0.8
              }}
            >
              Import MyChart Master File (XML)
            </button>
            <input 
              type="file" 
              ref={masterFileInputRef} 
              onChange={handleMasterFileImport} 
              style={{ display: 'none' }} 
              accept=".xml" 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1px solid ${theme.colors.accentBlue}`,
                backgroundColor: 'transparent',
                color: theme.colors.accentBlue,
                cursor: 'pointer',
                fontSize: '0.75rem',
                opacity: 0.8
              }}
            >
              Import Data (JSON)
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              style={{ display: 'none' }} 
              accept=".json" 
            />
            <button 
              onClick={() => setExportConfirmation('csv')}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1px solid ${theme.colors.leafGreen}`,
                backgroundColor: 'transparent',
                color: theme.colors.leafGreen,
                cursor: 'pointer',
                fontSize: '0.75rem',
                opacity: 0.8
              }}
            >
              Export Vitals (CSV)
            </button>
            <button 
              onClick={handleReset}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1px solid ${theme.colors.errorRed}`,
                backgroundColor: 'transparent',
                color: theme.colors.errorRed,
                cursor: 'pointer',
                fontSize: '0.75rem',
                opacity: 0.8
              }}
            >
              Reset All Test Data
            </button>
          </div>
        </footer>
      </main>

      {exportConfirmation && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 2000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: theme.borderRadius,
            maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: theme.colors.accentBlue, marginBottom: '15px' }}>
              {exportInfo[exportConfirmation].title}
            </h3>
            <p style={{ color: theme.colors.textDark, fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
              {exportInfo[exportConfirmation].description}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setExportConfirmation(null)}
                style={{
                  padding: '10px 20px', borderRadius: '20px', border: '1px solid #ddd',
                  backgroundColor: 'white', color: '#666', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  exportInfo[exportConfirmation].action();
                  setExportConfirmation(null);
                }}
                style={{
                  padding: '10px 20px', borderRadius: '20px', border: 'none',
                  backgroundColor: theme.colors.leafGreen, color: 'white', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                Confirm Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;