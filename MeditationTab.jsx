import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { theme } from './src/theme';

const MeditationTab = () => {
  const [seconds, setSeconds] = useState(300); // 5 mins default
  const [isActive, setIsActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [breathCount, setBreathCount] = useState(4);

  const iconOutline = { filter: 'drop-shadow(1px 1px 0 #000) drop-shadow(-1px 1px 0 #000) drop-shadow(1px -1px 0 #000) drop-shadow(-1px -1px 0 #000)' };

  // Meditation Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Breathing Pacer Logic (4-4-4 Box Breathing)
  useEffect(() => {
    const pacer = setInterval(() => {
      setBreathCount(prev => {
        if (prev === 1) {
          setBreathingPhase(current => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(pacer);
  }, []);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
      {/* Breathing Pacer */}
      <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <h3 style={{ color: theme.colors.accentBlue, marginBottom: '2rem' }}>Breathing Pacer</h3>
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          border: `2px solid ${theme.colors.leafGreen}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 1s ease-in-out',
          transform: breathingPhase === 'Inhale' ? 'scale(1.2)' : breathingPhase === 'Exhale' ? 'scale(0.9)' : 'scale(1.1)',
          backgroundColor: breathingPhase === 'Inhale' ? 'rgba(30, 58, 138, 0.1)' : 'transparent'
        }}>
          <Wind size={32} color={theme.colors.leafGreen} style={{ marginBottom: '8px' }} />
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: theme.colors.textDark }}>{breathingPhase}</div>
          <div style={{ fontSize: '0.9rem', color: '#888' }}>{breathCount}s</div>
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
          Follow the circle to regulate your nervous system.
        </p>
      </div>

      {/* Meditation Timer */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h3 style={{ color: theme.colors.accentBlue, marginBottom: '1.5rem' }}>Silent Meditation</h3>
        <div style={{ fontSize: '4rem', fontWeight: '200', color: '#1A1C1E', margin: '1rem 0' }}>
          {formatTime(seconds)}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => setSeconds(300)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>5m</button>
          <button onClick={() => setSeconds(600)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>10m</button>
          <button onClick={() => setSeconds(900)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>15m</button>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={() => setIsActive(!isActive)} 
            className="btn" 
            style={{ background: isActive ? '#FFCDD2' : '#90CAF9', border: 'none', color: isActive ? '#D32F2F' : '#1976D2', width: '60px', height: '60px', borderRadius: '50%' }}
          >
            {isActive ? <Pause size={24} style={iconOutline} /> : <Play size={24} style={iconOutline} />}
          </button>
          <button 
            onClick={() => { setIsActive(false); setSeconds(300); }} 
            className="btn" 
            style={{ background: '#B3D7FF', border: 'none', width: '60px', height: '60px', borderRadius: '50%' }}
          >
            <RotateCcw size={24} style={iconOutline} />
          </button>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'left', padding: '1rem', background: '#B3D7FF', borderRadius: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', lineHeight: '1.6' }}>
            <strong>Daily Mantra:</strong> "I am the advocate for my own well-being. My symptoms are data, and my peace is a priority."
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeditationTab;