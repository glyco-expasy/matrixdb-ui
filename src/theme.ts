import { createTheme } from '@mui/material/styles';
// teaches the theme's TypeScript types about the DataGrid component keys (MuiDataGrid) used below
import type {} from '@mui/x-data-grid/themeAugmentation';

// One place for the look of the app. The components were built on MUI defaults plus inline styles; this theme restyles every
// MUI component (tabs, tables, tooltips, buttons, papers) at once. The matching CSS variables live in index.css.
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1f5fae', dark: '#164a8a', light: '#e6effa' },
        secondary: { main: '#0f8b8d' },
        background: { default: '#f4f6fa', paper: '#ffffff' },
        text: { primary: '#1b2a41', secondary: '#55657d' },
        divider: '#e3e8f0',
    },
    shape: { borderRadius: 10 },
    typography: {
        h3: { fontWeight: 700, letterSpacing: '-0.01em' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
                elevation1: { boxShadow: '0 1px 2px rgba(16,24,40,0.05), 0 4px 14px rgba(16,24,40,0.07)' },
            },
        },
        MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3 } } },
        MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, fontSize: '0.92rem', minHeight: 44 } } },
        MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
        MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { backgroundColor: '#1b2a41', fontSize: '0.78rem', borderRadius: 8, padding: '6px 10px' },
                arrow: { color: '#1b2a41' },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: { border: '1px solid #e3e8f0', borderRadius: 10, fontSize: '0.9rem' },
                columnHeaders: { backgroundColor: '#f1f5fb', borderBottom: '1px solid #e3e8f0' },
                columnHeaderTitle: { fontWeight: 700, color: '#33445c' },
                row: { '&:hover': { backgroundColor: '#f7faff' } },
                cell: { borderColor: '#eef2f8' },
            },
        },
    },
});

export default theme;
