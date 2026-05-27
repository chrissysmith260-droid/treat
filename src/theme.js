import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  ':root': {
    // Color Palette
    'Primary': '#6366f1',
    'PrimaryHover': '#4f46e5',
    'Secondary': '#ec4899',
    'Background': '#f1f5f9',
    'Surface': '#ffffff',
    'TextMain': '#1e293b',
    'TextMuted': '#64748b',
    'Border': [{ 'unit': 'string', 'value': '#e2e8f0' }],
    'Success': '#22c55e',
    'Error': '#ef4444',
    // Spacing & Borders
    'RadiusSm': '6px',
    'RadiusMd': '12px',
    'RadiusLg': '20px',
    'ShadowSm': '0 1px 3px rgba(0,0,0,0.1)',
    'ShadowMd': '0 4px 6px -1px rgba(0,0,0,0.1)',
    // Typography
    'FontSans': ''Inter', -apple-system, sans-serif'
  },
  'body': {
    'backgroundColor': 'var(--background)',
    'color': 'var(--text-main)',
    'fontFamily': 'var(--font-sans)',
    'WebkitFontSmoothing': 'antialiased',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  }
});
