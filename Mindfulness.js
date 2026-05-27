import React, { useState, useEffect, useRef } from 'react';

const Mindfulness = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mantra, setMantra] = useState("no when, no want, no worry.");
  const [isFinished, setIsFinished] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleStart = (mins) => {
    setSeconds(mins * 60);
    setIsActive(true);
    setIsFinished(false);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F0F7FF', borderRadius: '20px', transition: 'opacity 2s' }}>
      <h2 style={{ color: '#5C92B1' }}>Mindfulness Space</h2>
      
      {!isActive && !isFinished && (
        <div className="timer-controls">
          <input 
            type="text" 
            value={mantra} 
            onChange={(e) => setMantra(e.target.value)}
            style={{ width: '80%', padding: '10px', borderRadius: '10px', border: '1px solid #90CAF9', marginBottom: '1rem' }}
          />
          <div>
            {[5, 10, 20].map(m => (
              <button key={m} onClick={() => handleStart(m)} style={{ margin: '5px', padding: '10px 20px', borderRadius: '15px', backgroundColor: '#90CAF9', border: 'none', color: 'white' }}>
                {m} Minutes
              </button>
            ))}
          </div>
        </div>
      )}

      {isActive && (
        <div style={{ fontSize: '3rem', color: '#37474F' }}>
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>"{mantra}"</p>
        </div>
      )}

      {isFinished && (
        <div style={{ animation: 'fadeIn 3s', padding: '2rem' }}>
          <p style={{ fontSize: '1.5rem', color: '#5C92B1', lineHeight: '1.6' }}>
            safety is natural. you are not your illness, but you are worthy and your illness is real.
          </p>
          <button onClick={() => setIsFinished(false)} style={{ background: 'none', border: '1px solid #90CAF9', color: '#90CAF9', padding: '5px 15px', borderRadius: '10px' }}>
            Return to peace
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <label>
          Background Music
          <input 
            type="checkbox" 
            checked={musicOn} 
            onChange={() => setMusicOn(!musicOn)} 
            style={{ marginLeft: '10px' }}
          />
        </label>
        {musicOn && (
           <div style={{ marginTop: '10px' }}>
             <audio ref={audioRef} controls loop style={{ height: '30px' }}>
               <source src="path-to-soft-music.mp3" type="audio/mpeg" />
             </audio>
           </div>
        )}
      </div>
    </div>
  );
};
export default Mindfulness;