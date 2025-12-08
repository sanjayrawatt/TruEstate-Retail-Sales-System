# TrueState Backend

## Overview
Backend service for the Retail Sales Management System built with Node.js and Express. Handles CSV data loading, filtering, sorting, searching, and pagination for 1000 sales records.

## Tech Stack

### Core Framework
- **Node.js (v22.18.0)**: JavaScript runtime for server-side execution
- **Express.js (v4.18.2)**: Lightweight web framework for building RESTful APIs

### Data Processing
- **csv-parser (v3.2.0)**: Streams CSV files and converts rows to JavaScript objects
- **ES6 Modules**: Modern JavaScript module system with `import/export` syntax

### Server Features
- **CORS (v2.8.5)**: Cross-Origin Resource Sharing middleware for frontend communication
- **Memory Management**: `--max-old-space-size=4096` flag to handle large datasets efficiently

## How We're Using Them

### Express & Node.js
- **Express** routes handle API requests for sales data with query parameters for filtering, sorting, and pagination
- **Node.js** streams process the large CSV file efficiently without loading entire file into memory
- Async/await patterns ensure non-blocking operations

### CSV Processing
- **csv-parser** streams data from `truestate_assignment_dataset.csv` 
- Limits loading to first 1000 records for performance
- Automatically parses field names and converts data types

### CORS
- Enables frontend (port 3151) to communicate with backend (port 5151)
- Allows cross-origin requests for API endpoints

## Project Structure
```
backend/
├── src/
│   ├── index.js              # Server startup & initialization
│   ├── controllers/
│   │   └── salesController.js # Request handlers
│   ├── routes/
│   │   └── salesRoutes.js     # API endpoints
│   └── services/
│       └── salesService.js    # Business logic & data operations
└── data/
    └── truestate_assignment_dataset.csv # Source data file
```

## API Endpoints

### GET `/api/sales`
Returns paginated sales data with optional search, filters, and sorting.

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 10)
- `search` - Customer name or phone number
- `customerRegion`, `gender`, `productCategory`, `paymentMethod` - Multi-select filters
- `ageMin`, `ageMax` - Age range filter
- `dateStart`, `dateEnd` - Date range filter
- `sortBy` - `date`, `quantity`, or `customerName`
- `sortOrder` - `asc` or `desc`

### GET `/api/filter-options`
Returns unique values for all filter options (regions, genders, categories, payment methods, tags).

## Running the Backend

```bash
npm install
npm start          # Production with memory optimization
npm run dev        # Development with nodemon
```

Server runs on **http://localhost:5151**
