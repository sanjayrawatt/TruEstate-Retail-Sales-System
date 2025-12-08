# TrueState - Retail Sales Management System

## Overview
TrueState is a full-stack retail sales management dashboard that enables users to explore and analyze 1000 sales transactions. Built with React and Node.js, it provides powerful search, filtering, sorting, and pagination capabilities with a modern dark-themed interface. The system processes real CSV data efficiently and delivers a responsive user experience across all devices.

## Tech Stack

### Backend
- **Node.js**: Server runtime with ES6 modules
- **Express.js**: RESTful API framework
- **csv-parser**: CSV data streaming and parsing

### Frontend
- **React 18**: Component-based UI library with hooks
- **Vite**: Next-generation build tool with HMR
- **CSS3**: Custom styling with gradients and flexbox

### Data & Infrastructure
- **CSV Data**: 1000 sales records loaded on startup
- **In-Memory Storage**: Fast data access with caching
- **CORS**: Cross-origin communication between frontend and backend

## Search Implementation Summary

**Location**: `frontend/src/components/SearchBar.jsx` & `backend/src/services/salesService.js`

The search feature performs **case-insensitive full-text matching** on two fields:
- Customer Name
- Phone Number

**Frontend**: Real-time input handler updates state and triggers API call
**Backend**: `applySearch()` filters dataset using `.includes()` for matching records
**UX**: Debounced search with instant results and visual feedback

## Filter Implementation Summary

**Location**: `frontend/src/components/FilterPanel.jsx` & `backend/src/services/salesService.js`

Multi-select and range filters across 6 dimensions:

| Filter Type | Fields | Implementation |
|-------------|--------|-----------------|
| Multi-select | Region, Gender, Category, Payment Method, Tags | Array matching with `.includes()` |
| Range | Age, Date | Min/max boundary checks |
| Collapsible UI | Filter panel toggles to save space | CSS display/hide with smooth transition |

**Backend**: `applyFilters()` sequentially checks each active filter
**State**: Filters persist across pagination and sorting operations

## Sorting Implementation Summary

**Location**: `frontend/src/components/SortingDropdown.jsx` & `backend/src/services/salesService.js`

Supports ascending/descending sort on 3 fields:
- **Date**: Chronological order (new/old)
- **Quantity**: Numerical order (high/low)
- **Customer Name**: Alphabetical order (A-Z/Z-A)

**Backend**: `applySorting()` uses `.sort()` with type-specific comparisons
**Default**: Newest transactions first
**Reset**: "None" option clears sorting

## Pagination Implementation Summary

**Location**: `frontend/src/components/Pagination.jsx` & `backend/src/services/salesService.js`

**Page Size**: 10 records per page (fixed)
**Total Records**: 1000 (first 1000 from CSV)
**Total Pages**: 100

**Implementation**:
- Frontend sends `page` query parameter
- Backend calculates start/end indices: `(page - 1) * pageSize`
- Returns paginated slice + metadata (total, page, pageSize, totalPages)
- UI updates on page click with no data loss from filters/sorts

**Navigation**: Previous/Next buttons + direct page selection

## Setup Instructions

### Prerequisites
- Node.js v22.18.0+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify CSV file exists**
   ```bash
   ls -la data/truestate_assignment_dataset.csv
   ```

4. **Start server (production)**
   ```bash
   npm start
   ```
   Or development mode with auto-reload:
   ```bash
   npm run dev
   ```

   Server runs on **http://localhost:5151**

### Frontend Setup

1. **In a new terminal, navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```

   App runs on **http://localhost:3151**

### Access the Application

Open your browser and navigate to:
```
http://localhost:3151
```

You should see the Sales Dashboard with all 1000 records paginated at 10 per page.

### File Structure

```
TrueState/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   ├── data/
│   │   └── truestate_assignment_dataset.csv
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── README.md
└── docs/
    └── architecture.md
```

### Troubleshooting

**Port Already in Use**
```bash
# Kill process on port 5151
kill -9 $(lsof -ti:5151)

# Kill process on port 3151
kill -9 $(lsof -ti:3151)
```

**CSV File Not Found**
- Ensure `truestate_assignment_dataset.csv` is in `backend/data/` directory
- Check file is readable: `file backend/data/truestate_assignment_dataset.csv`

**CORS Errors**
- Verify backend is running on port 5151
- Check vite proxy config points to `http://localhost:5151`
- Clear browser cache and hard refresh (Cmd+Shift+R)

## Documentation
See `docs/architecture.md` for system architecture and data flow diagrams.
