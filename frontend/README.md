# TrueState Frontend

## Overview
React-based dashboard for the Retail Sales Management System. Provides real-time search, multi-select filtering, sorting, and pagination for browsing 1000 sales records with a responsive dark theme UI.

## Tech Stack

### Frontend Framework
- **React 18**: Modern UI library with hooks for state management
- **Vite (v5.4.21)**: Lightning-fast build tool and dev server with hot module replacement

### Styling & UI
- **CSS3**: Custom stylesheets for responsive dark theme design
- **CSS Gradients & Flexbox**: Modern CSS features for layout and visual effects

### API Communication
- **Fetch API**: Native browser API for HTTP requests
- **Axios-like patterns**: Promise-based HTTP client implementation

### Development Tools
- **ES6 Modules**: Modern JavaScript syntax with `import/export`
- **@vitejs/plugin-react**: Fast refresh for seamless development experience

## How We're Using Them

### React & State Management
- **Functional components** with `useState` and `useEffect` hooks for managing UI state
- **Custom hooks** (`useSalesData.js`) encapsulate search, filter, sort, and pagination logic
- **Component composition** separates concerns: SearchBar, FilterPanel, SortingDropdown, Pagination, TransactionTable

### Vite
- **Development server** on port 3151 with proxy to backend (port 5151)
- **Hot Module Replacement (HMR)** for instant code updates without page reload
- **Fast build process** for production-ready optimized bundles

### API Communication
- **Fetch API** with error handling and loading states
- **Query parameters** construction for dynamic filtering, sorting, and pagination
- **CORS proxy** configured in `vite.config.js` to communicate with backend

### Styling
- **Dark theme design** with blue accent gradients for professional appearance
- **Responsive layouts** using Flexbox for desktop and mobile compatibility
- **CSS animations** for smooth transitions and user interactions

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── SalesManagement.jsx   # Main dashboard container
│   │   ├── SearchBar.jsx         # Full-text search input
│   │   ├── FilterPanel.jsx       # Multi-select & range filters
│   │   ├── SortingDropdown.jsx   # Sort options
│   │   ├── Pagination.jsx        # Page navigation
│   │   └── TransactionTable.jsx  # Data display table
│   ├── hooks/
│   │   └── useSalesData.js       # Custom hook for data logic
│   ├── services/
│   │   └── api.js                # API client functions
│   ├── styles/
│   │   ├── index.css             # Global styles
│   │   └── [Component].css       # Component-specific styles
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # React entry point
├── vite.config.js                # Vite configuration
├── index.html                    # HTML template
└── package.json                  # Dependencies & scripts
```

## Running the Frontend

```bash
npm install
npm run dev        # Start dev server on port 3151
npm run build      # Build for production
npm run preview    # Preview production build
```

App runs on **http://localhost:3151**
