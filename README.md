# TrueState - Retail Sales Management System

## Overview
TrueState is a full-stack retail sales management dashboard built with React, Node.js, and MongoDB. It displays 580,000 transaction records with powerful search, filtering, sorting, and pagination capabilities. Users can explore sales data with a modern dark-themed interface featuring a responsive sidebar layout and real-time analytics.

## Tech Stack

### Backend
- **Node.js**: Server runtime with ES6 modules
- **Express.js**: RESTful API framework  
- **MongoDB**: Cloud database with Atlas integration
- **Mongoose**: ODM for MongoDB queries

### Frontend
- **React 18**: Component-based UI library with hooks
- **Vite**: Next-generation build tool with HMR
- **CSS3**: Custom styling with gradients and flexbox

### Data & Infrastructure
- **MongoDB Atlas**: Cloud database for 580,000 records
- **CORS**: Cross-origin communication between frontend and backend

## Search Implementation Summary

**Location**: `frontend/src/components/SearchBar.jsx` & `backend/src/services/salesService.js`

Case-insensitive full-text search across Customer Name and Phone Number fields. Frontend sends search query to backend which filters MongoDB documents using regex matching. Results display instantly with pagination preserved.

## Filter Implementation Summary

**Location**: `frontend/src/components/FilterPanel.jsx` & `backend/src/services/salesService.js`

Multi-select filters (Region, Gender, Category, Payment Method, Tags) and range filters (Age, Date Range). Filters persist across pagination. Backend applies MongoDB query operators ($in, $gte, $lte) to match documents. Sidebar remains always visible for easy filter access.

## Sorting Implementation Summary

**Location**: `frontend/src/components/SortingDropdown.jsx` & `backend/src/services/salesService.js`

Supports ascending/descending sort on Date, Quantity, and Customer Name. Default sorting shows newest transactions first. Backend applies sorting before pagination. Reset option clears sorting and returns to default order.

## Pagination Implementation Summary

**Location**: `frontend/src/components/Pagination.jsx` & `backend/src/services/salesService.js`

10 records per page across 58,000 total pages. Frontend sends page parameter, backend calculates offsets and returns paginated data with metadata. State preserved across filter/sort operations. Direct page selection and Previous/Next navigation available.

## Setup Instructions

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB Atlas account (for cloud database)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Add MongoDB Atlas connection string: your_mongodb_connection_string

4. **Start server**
   ```bash
   npm start
   ```
   Or development mode:
   ```bash
   npm run dev
   ```
   Server runs on **http://localhost:5151**

### Frontend Setup

1. **In new terminal, navigate to frontend**
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

### Access Application

Open browser and navigate to **http://localhost:3151**

You should see the Sales Dashboard with 580,000 records paginated at 10 per page.

### File Structure

```
TrueState/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
└── README.md
```

### Troubleshooting

**Port Already in Use**
```bash
kill -9 $(lsof -ti:5151)  # Backend
kill -9 $(lsof -ti:3151)  # Frontend
```

**MongoDB Connection Failed**
- Verify connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Check network connectivity

**CORS Errors**
- Verify backend is running on port 5151
- Check vite proxy config in `vite.config.js`
- Clear browser cache and hard refresh

## Documentation
See `docs/architecture.md` for system architecture and data flow.
