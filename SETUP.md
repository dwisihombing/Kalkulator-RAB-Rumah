# Development Setup Guide

## Quick Start

### Option 1: Using Python HTTP Server
```bash
python3 -m http.server 8000 --directory .
```
Then open: `http://localhost:8000`

### Option 2: Using Node.js
```bash
npx http-server
```

### Option 3: Direct Browser
Simply open `index.html` directly in your browser.

## Project Structure
```
Kalkulator-RAB-Rumah/
├── index.html          # Main application
├── README.md           # Project documentation
├── package.json        # Project metadata
├── .gitignore          # Git ignore patterns
└── SETUP.md            # This file
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design works on mobile and desktop

## Next Steps
1. Customize the calculator with your own cost items
2. Optimize styling for your brand
3. Consider adding data export/import features
4. Add local storage for saving calculations

## Troubleshooting
- If JavaScript console shows errors, check browser console (F12)
- Ensure you're running a local server (not opening file:// directly for better compatibility)
