export const styles = {
  appContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem 2rem',
    minHeight: '100vh',
    background: '#EBF5FF'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    marginTop: '1rem'
  },
  card: {
    background: '#CCE5FF',
    border: '1px solid #E3E8ED',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    borderRadius: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    border: '1px solid #E3E8ED',
    background: 'transparent',
    color: '#1A1C1E',
    transition: 'all 0.2s ease'
  },
  btnPrimary: {
    background: '#1A1C1E',
    color: '#FFFFFF',
    textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
    border: 'none'
  },
  btnSecondary: {
    background: '#F1F3F5',
    color: '#495057',
    border: 'none'
  },
  navMenu: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '3rem',
    borderBottom: '1px solid #E3E8ED',
    paddingBottom: '1rem'
  },
  navItem: {
    cursor: 'pointer',
    fontWeight: '500',
    opacity: '0.7',
    position: 'relative',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    letterSpacing: '-0.025em'
  },
  paymentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem'
  },
  cardInput: {
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)'
  },
  chartContainer: {
    height: '300px',
    width: '100%',
    marginTop: '1rem'
  }
};
