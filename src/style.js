import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  '*': {
    'boxSizing': 'border-box',
    'transition': 'background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s'
  },
  'app-container': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'rem', 'value': 2 }, { 'unit': 'rem', 'value': 2 }, { 'unit': 'rem', 'value': 2 }, { 'unit': 'rem', 'value': 2 }]
  },
  'dashboard-grid': {
    'display': 'grid',
    'gridTemplateColumns': '2fr 1fr',
    'gap': '1.5rem',
    'marginTop': [{ 'unit': 'rem', 'value': 2 }]
  },
  'card': {
    'background': 'var(--surface)',
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'var(--border)' }],
    'borderRadius': 'var(--radius-md)',
    'padding': [{ 'unit': 'rem', 'value': 1.5 }, { 'unit': 'rem', 'value': 1.5 }, { 'unit': 'rem', 'value': 1.5 }, { 'unit': 'rem', 'value': 1.5 }],
    'boxShadow': [{ 'unit': 'string', 'value': 'var(--shadow-sm)' }, { 'unit': 'string', 'value': 'var(--shadow-sm)' }, { 'unit': 'string', 'value': 'var(--shadow-sm)' }, { 'unit': 'string', 'value': 'var(--shadow-sm)' }]
  },
  'btn': {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'gap': '0.5rem',
    'padding': [{ 'unit': 'rem', 'value': 0.75 }, { 'unit': 'rem', 'value': 1.5 }, { 'unit': 'rem', 'value': 0.75 }, { 'unit': 'rem', 'value': 1.5 }],
    'fontSize': [{ 'unit': 'rem', 'value': 0.95 }],
    'borderRadius': 'var(--radius-sm)',
    'fontWeight': '600',
    'cursor': 'pointer',
    'transition': 'all 0.2s',
    'border': [{ 'unit': 'string', 'value': 'none' }]
  },
  'btn-primary': {
    'background': 'linear-gradient(to bottom right, var(--primary), var(--primary-hover))',
    'color': 'white',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 4 }, { 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(99, 102, 241, 0.39)' }]
  },
  'btn-primary:hover': {
    'background': 'var(--primary-hover)',
    'transform': 'translateY(-1px)',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'string', 'value': 'rgba(99, 102, 241, 0.23)' }]
  },
  'btn-primary:active': {
    'transform': 'translateY(0)'
  },
  'header': {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'marginBottom': [{ 'unit': 'rem', 'value': 2 }]
  },
  'stat-card': {
    'textAlign': 'center'
  },
  'stat-value': {
    'fontSize': [{ 'unit': 'rem', 'value': 2.5 }],
    'fontWeight': '700',
    'color': 'var(--primary)',
    'letterSpacing': [{ 'unit': 'em', 'value': -0.025 }]
  },
  'payment-form': {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '1rem',
    'marginTop': [{ 'unit': 'rem', 'value': 1 }]
  },
  'card-input': {
    'padding': [{ 'unit': 'rem', 'value': 0.75 }, { 'unit': 'rem', 'value': 0.75 }, { 'unit': 'rem', 'value': 0.75 }, { 'unit': 'rem', 'value': 0.75 }],
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'var(--border)' }],
    'borderRadius': 'var(--radius-sm)'
  },
  'chart-container': {
    'height': [{ 'unit': 'px', 'value': 300 }],
    'width': [{ 'unit': '%H', 'value': 1 }],
    'marginTop': [{ 'unit': 'rem', 'value': 1 }]
  }
});
