import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  ':root': {
    // Color Palette
    'Primary': '#ffffff',
    'PrimaryHover': '#f1f5f9',
    'Secondary': '#ec4899',
    'Background': '#1e3a8a',
    // Calming Deep Blue
    'Surface': 'rgba(255, 255, 255, 0.1)',
    // Transparent Glass Effect
    'TextMain': '#ffffff',
    'TextMuted': '#cbd5e1',
    'Border': [{ 'unit': 'string', 'value': '#ffffff' }],
    // White Outlines
    'Success': '#22c55e',
    'Error': '#ef4444',
    // Spacing & Borders
    'RadiusSm': '8px',
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
