import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  '*': {
    'boxSizing': 'border-box',
    'transition': 'all 0.2s ease-in-out'
  },
  'app-container': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'rem', 'value': 2 }, { 'unit': 'rem', 'value': 2 }, { 'unit': 'rem', 'value': 2 }, { 'unit': 'rem', 'value': 2 }],
    'minHeight': [{ 'unit': 'vh', 'value': 100 }]
  },
  'dashboard-grid': {
    'display': 'grid',
    'gridTemplateColumns': '2fr 1fr',
    'gap': '1.5rem',
    'marginTop': [{ 'unit': 'rem', 'value': 2 }]
  },
  'card': {
    'background': 'rgba(255, 255, 255, 0.05)',
    'backdropFilter': 'blur(10px)',
    'border': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'var(--border)' }],
    'borderRadius': 'var(--radius-md)',
    'padding': [{ 'unit': 'rem', 'value': 1.5 }, { 'unit': 'rem', 'value': 1.5 }, { 'unit': 'rem', 'value': 1.5 }, { 'unit': 'rem', 'value': 1.5 }]
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
    'border': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'var(--border)' }],
    'background': 'transparent',
    'color': 'white'
  },
  'btn-primary': {
    'background': 'white',
    'color': 'var(--background)'
  },
  'btn-primary:hover': {
    'background': 'rgba(255, 255, 255, 0.9)',
    'transform': 'scale(1.02)'
  },
  'nav-menu': {
    'display': 'flex',
    'gap': '2rem',
    'marginBottom': [{ 'unit': 'rem', 'value': 3 }],
    'borderBottom': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(255, 255, 255, 0.2)' }],
    'paddingBottom': [{ 'unit': 'rem', 'value': 1 }]
  },
  'nav-item': {
    'cursor': 'pointer',
    'fontWeight': '500',
    'opacity': '0.7',
    'position': 'relative'
  },
  'nav-itemactive': {
    'opacity': '1'
  },
  'nav-itemactive::after': {
    'content': '''',
    'position': 'absolute',
    'bottom': [{ 'unit': 'rem', 'value': -1.2 }],
    'left': [{ 'unit': 'px', 'value': 0 }],
    'width': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': 'px', 'value': 3 }],
    'background': 'white'
  },
  'header': {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'marginBottom': [{ 'unit': 'rem', 'value': 2 }]
  },
  'stat-value': {
    'fontSize': [{ 'unit': 'rem', 'value': 2.5 }],
    'fontWeight': '700',
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
