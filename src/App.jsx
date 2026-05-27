import React, { useState, useEffect, useMemo } from 'react';
import { CreditCard, Layout, Zap, Activity, ClipboardList, Heart, Wind, Leaf } from 'lucide-react';
import AIReportCompiler from '../AIReportCompiler.jsx';
import VitalsTracker from '../VitalsTracker.jsx';
import MeditationTab from '../MeditationTab.jsx';
import SymptomLogger from '../SymptomLogger.jsx';
import MedicationsTable from '../MedicationsTable.jsx';
import AllergiesTable from '../AllergiesTable.jsx';
import VitalsChart from '../VitalsChart.jsx';
import LabsTable from '../LabsTable.jsx';
import AppointmentsTable from '../AppointmentsTable.jsx';
import NotesTable from '../NotesTable.jsx';
import MasterFileImport from '../MasterFileImport.jsx';
import { theme } from './theme'; // Import theme
import './style.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSubscribed, setIsSubscribed] = useState(() => localStorage.getItem('treat_ai_unlocked') === 'true');
  
  // Medical History State
  const [symptoms, setSymptoms] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labs, setLabs] = useState([]);
  const [notes, setNotes] = useState([]);
  
  const handleImport = (data) => {
    if (data.medications) setMedications(prev => [...data.medications, ...prev]);
    if (data.allergies) setAllergies(prev => [...data.allergies, ...prev]);
    if (data.labs) setLabs(prev => [...data.labs, ...prev]);
    if (data.appointments) setAppointments(prev => [...data.appointments, ...prev]);
  };

  const activeNavItemStyle = {
    background: theme.colors.primaryBlue,
    color: theme.colors.accentBlue,
    fontWeight: 'bold',
  };
  return (
    <div className="app-container" style={{ background: '#EBF5FF' }}>
      <nav className="nav-menu">
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '20px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={32} color="#81C784" fill="#81C784" />
            <span style={{ 
              position: 'absolute', 
              color: '#FFD700', 
              fontWeight: '900', 
              fontSize: '14px',
              fontFamily: 'serif',
              marginTop: '2px'
            }}>t</span>
          </div>
          <span style={{ fontWeight: 'bold', color: '#2D3436', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>treat</span>
        </div>
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Layout size={20} style={activeTab === 'dashboard' ? { color: theme.colors.accentBlue } : {}} /> Dashboard
        </div>
        <div 
          className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} 
          onClick={() => setActiveTab('logs')}
          style={activeTab === 'logs' ? activeNavItemStyle : {}}
        >
          <ClipboardList size={20} style={activeTab === 'logs' ? { color: theme.colors.accentBlue } : {}} /> History
        </div>
        <div 
          className={`nav-item ${activeTab === 'vitals' ? 'active' : ''}`} 
          onClick={() => setActiveTab('vitals')}
          style={activeTab === 'vitals' ? activeNavItemStyle : {}}
        >
          <Activity size={20} style={activeTab === 'vitals' ? { color: theme.colors.accentBlue } : {}} /> Vitals
        </div>
        <div 
          className={`nav-item ${activeTab === 'report' ? 'active' : ''}`} 
          onClick={() => setActiveTab('report')}
          style={activeTab === 'report' ? activeNavItemStyle : {}}
        >
          <Zap size={20} style={activeTab === 'report' ? { color: theme.colors.accentBlue } : {}} /> AI Report
        </div>
        <div 
          className={`nav-item ${activeTab === 'mindfulness' ? 'active' : ''}`} 
          onClick={() => setActiveTab('mindfulness')}
          style={activeTab === 'mindfulness' ? activeNavItemStyle : {}}
        >
          <Wind size={20} style={activeTab === 'mindfulness' ? { color: theme.colors.accentBlue } : {}} /> Mindfulness
        </div>
      </nav>

      {activeTab === 'dashboard' && (
        <div className="view-content">
          <header className="header">
            <h1 style={{ color: '#1A1C1E' }}>Patient Dashboard</h1>
            <div className="header-actions">
              <a href="https://cash.app/$Christina-Smith-910" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#FFF0F3', border: 'none', color: '#FF4D6D' }}>
                <Heart size={18} fill="#FF4D6D" /> Support treat
              </a>
            </div>
          </header>
          
          <div className="dashboard-grid">
            <section className="card">
              <h3>Recent Logs</h3>
              {symptoms.length === 0 ? <p className="text-muted">No symptoms logged yet.</p> : (
                <ul>{symptoms.slice(0, 3).map((s, i) => <li key={i}>{s.name} - {s.date}</li>)}</ul>
              )}
            </section>
            <section className="card">
              <h3>Latest Vitals</h3>
              {vitalsHistory.length === 0 ? <p className="text-muted">No vitals recorded.</p> : (
                <p>Last recorded: {vitalsHistory[0].timestamp}</p>
              )}
            </section>
          </div>
        </div>
      )}

      {activeTab === 'mindfulness' && (
        <div className="view-content">
          <h1 style={{ color: '#1A1C1E' }}>Mindfulness Suite</h1>
          <p className="text-muted">Take a moment for yourself with guided breathing and meditation.</p>
          <MeditationTab />
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="view-content">
          <h1>Medical History</h1>
          <p className="text-muted">Log your medications, allergies, and symptoms for your records.</p>
          <div style={{ display: 'grid', gap: '2rem' }}>
            <MasterFileImport onImport={handleImport} />
            <SymptomLogger symptoms={symptoms} setSymptoms={setSymptoms} />
            <NotesTable notes={notes} setNotes={setNotes} />
            <MedicationsTable medications={medications} setMedications={setMedications} />
            <AllergiesTable allergies={allergies} setAllergies={setAllergies} />
            <LabsTable labs={labs} />
            <AppointmentsTable appointments={appointments} />
          </div>
        </div>
      )}

      {activeTab === 'vitals' && (
        <div className="view-content">
          <h1>Vitals Tracker</h1>
          <VitalsChart data={vitalsHistory} />
          <VitalsTracker onLogVitals={(v) => setVitalsHistory([v, ...vitalsHistory])} />
        </div>
      )}

      {activeTab === 'report' && (
        <div className="view-content">
          <h1>AI Medical Report</h1>
          <section className="card">
            <AIReportCompiler 
              symptoms={symptoms}
              vitalsHistory={vitalsHistory}
              medications={medications}
              allergies={allergies}
              appointments={appointments}
              labs={labs}
              notes={notes}
              isSubscribed={isSubscribed}
              setIsSubscribed={setIsSubscribed}
            />
          </section>
        </div>
      )}
    </div>
  );
};

export default App;