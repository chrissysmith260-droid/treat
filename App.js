import React from 'react';
import Mindfulness from './Mindfulness';
import VitalsTracker from './VitalsTracker';
import { theme } from './theme';
import { Leaf } from 'lucide-react';

const App = () => {
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
        <section>
          <VitalsTracker />
        </section>
        
        <section>
          <Mindfulness />
        </section>

        <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#777' }}>
          <p>Donations & AI Reports: $Christina-Smith-910</p>
        </footer>
      </main>
    </div>
  );
};

export default App;