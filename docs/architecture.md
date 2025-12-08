# TrueState System Architecture

## System Overview

TrueState is a full-stack monorepo application with a clear separation between backend and frontend, communicating through RESTful APIs.

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser (Port 3151)                │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              React Frontend (Vite)                    │ │
│  │  - SalesManagement.jsx (main container)              │ │
│  │  - SearchBar, FilterPanel, SortingDropdown           │ │
│  │  - TransactionTable, Pagination                      │ │
│  │  - useSalesData custom hook (state logic)            │ │
│  └───────────────────────────────────────────────────────┘ │
│                            │                                │
│                    Fetch API Calls                          │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                    HTTP Requests (CORS)
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Node.js Server (Port 5151)               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Express.js REST API                       │ │
│  │  GET /api/sales (paginated, filtered, sorted)         │ │
│  │  GET /api/filter-options (unique filter values)       │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         salesController.js (Request Handlers)         │ │
│  │  - handleGetSalesData()                               │ │
│  │  - handleGetFilterOptions()                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     salesService.js (Business Logic & Data Ops)       │ │
│  │  - loadSalesData() (streaming CSV)                    │ │
│  │  - getSalesData() (apply filters, sort, paginate)    │ │
│  │  - getFilterOptions() (unique values)                 │ │
│  │  - applySearch() -> applyFilters() -> applySorting()  │ │
│  │  - applyPagination()                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         In-Memory Data Store (Cache)                  │ │
│  │  - 1000 CSV records loaded on startup                 │ │
│  │  - Cached for fast access & filtering                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                    File System Access
                             │
                             ▼
                   CSV Data File (1000 records)
```

## Data Flow Diagram

### 1. Initial Load Flow

```
User Opens App (http://localhost:3151)
        │
        ▼
React App Mounts
        │
        ▼
useSalesData Hook Called (frontend/hooks/useSalesData.js)
        │
        ▼
Fetch GET /api/sales?page=1&pageSize=10
        │
        ▼
Backend Receives Request
        │
        ├─→ Check salesData cached? NO
        │   │
        │   ▼
        │   loadSalesData() starts
        │   │
        │   ▼
        │   createReadStream from CSV file
        │   │
        │   ▼
        │   Pipe through csv-parser
        │   │
        │   ▼
        │   First 1000 records loaded into memory
        │   │
        │   ▼
        │   salesData = [1000 records]
        │   │
        │   ▼
        │
        └─→ getSalesData({ page: 1, pageSize: 10 })
            │
            ▼
        applySearch() [no search, return all]
            │
            ▼
        applyFilters() [no filters, return all]
            │
            ▼
        applySorting() [default sort]
            │
            ▼
        applyPagination(data, 1, 10)
            │
            ▼
        Return { data: [10 records], pagination: {...} }
            │
            ▼
Frontend Receives JSON Response
        │
        ▼
Update State: setSalesData(data), setPagination(pagination)
        │
        ▼
Re-render with TransactionTable showing 10 records + Pagination
```

### 2. Search Flow

```
User Types in SearchBar
        │
        ▼
onChange Handler triggers
        │
        ▼
setFilters({ search: "john" })
        │
        ▼
useEffect dependency triggers
        │
        ▼
Fetch /api/sales?page=1&search=john&pageSize=10
        │
        ▼
Backend: getSalesData({ search: "john", page: 1, pageSize: 10 })
        │
        ▼
applySearch(data, "john")
  - Filter by Customer Name.includes("john") OR
  - Phone Number.includes("john")
  - Returns [matching records]
        │
        ▼
applyFilters() [apply any active filters]
        │
        ▼
applySorting() [apply sort]
        │
        ▼
applyPagination(filtered_data, 1, 10)
        │
        ▼
Return paginated results
        │
        ▼
Frontend updates table with filtered results
```

### 3. Filtering Flow

```
User Selects Filters (e.g., Region: "North", Gender: "Male")
        │
        ▼
setFilters({ ...filters, customerRegion: ["North"], gender: ["Male"] })
        │
        ▼
useEffect triggers API call
        │
        ▼
Fetch /api/sales?customerRegion=North&gender=Male&page=1&pageSize=10
        │
        ▼
Backend: getSalesData({ customerRegion: ["North"], gender: ["Male"], ... })
        │
        ▼
applySearch() [if search active]
        │
        ▼
applyFilters(data, { customerRegion: ["North"], gender: ["Male"] })
  ├─→ Filter: item["Customer Region"] in ["North"] ✓
  │
  └─→ Filter: item["Gender"] in ["Male"] ✓
  
  Returns [records matching ALL filters]
        │
        ▼
applySorting() [apply sort if any]
        │
        ▼
applyPagination(filtered_data, 1, 10)
        │
        ▼
Frontend displays filtered + paginated results
```

### 4. Sorting Flow

```
User Selects Sort Option (e.g., "Date - Newest")
        │
        ▼
setSorting({ sortBy: "date", sortOrder: "desc" })
        │
        ▼
useEffect triggers API call
        │
        ▼
Fetch /api/sales?sortBy=date&sortOrder=desc&page=1&pageSize=10
        │
        ▼
Backend: getSalesData({ sortBy: "date", sortOrder: "desc", ... })
        │
        ▼
applySearch() + applyFilters() [previous operations]
        │
        ▼
applySorting(data, "date", "desc")
  - Parse dates from all records
  - Sort in descending order (newest first)
  - Returns [sorted records]
        │
        ▼
applyPagination(sorted_data, 1, 10)
        │
        ▼
Frontend displays sorted paginated results
```

### 5. Pagination Flow

```
User Clicks Page 2
        │
        ▼
setCurrentPage(2)
        │
        ▼
useEffect triggers API call
        │
        ▼
Fetch /api/sales?page=2&pageSize=10&...filters...&...sort...
        │
        ▼
Backend: getSalesData({ page: 2, pageSize: 10, ... })
        │
        ▼
Apply all active operations:
  applySearch()
  + applyFilters()
  + applySorting()
        │
        ▼
applyPagination(final_data, 2, 10)
  - startIndex = (2 - 1) * 10 = 10
  - endIndex = 10 + 10 = 20
  - return { data: records[10:20], pagination: {...} }
        │
        ▼
Frontend receives records 11-20 of filtered/sorted dataset
        │
        ▼
TransactionTable updates with new data
        │
        ▼
Pagination component updates active page indicator
```

## Component Architecture

### Frontend Component Hierarchy

```
App.jsx (Root)
    │
    └─→ SalesManagement.jsx (Main Container)
        ├─→ Header (Sales Dashboard + SSR Logo)
        │
        ├─→ Stats Container
        │   ├─→ Total Revenue Card
        │   ├─→ Total Orders Card
        │   ├─→ Avg Order Value Card
        │   └─→ Items Sold Card
        │
        ├─→ Controls Section
        │   ├─→ SearchBar.jsx
        │   ├─→ SortingDropdown.jsx
        │   └─→ Clear Filters Button
        │
        ├─→ FilterPanel.jsx (Sidebar - Collapsible)
        │   ├─→ Customer Region (Multi-select)
        │   ├─→ Gender (Multi-select)
        │   ├─→ Age Range (Range slider)
        │   ├─→ Product Category (Multi-select)
        │   ├─→ Tags (Multi-select)
        │   ├─→ Payment Method (Multi-select)
        │   └─→ Date Range (Date picker)
        │
        └─→ Main Content
            ├─→ Results Header (showing count)
            ├─→ TransactionTable.jsx (10 rows per page)
            │   └─→ Column Headers: Date, Name, Phone, etc.
            │
            └─→ Pagination.jsx
                ├─→ Previous Button
                ├─→ Page Numbers
                └─→ Next Button
```

### Backend Structure

```
salesService.js (Business Logic)
├─→ loadSalesData()
│   └─→ csv-parser → In-memory cache
│
├─→ getSalesData(queryParams)
│   ├─→ applySearch(data, search)
│   ├─→ applyFilters(data, filters)
│   ├─→ applySorting(data, sortBy, sortOrder)
│   └─→ applyPagination(data, page, pageSize)
│
├─→ getFilterOptions()
│   └─→ Extract unique values from salesData
│
├─→ Helper Functions
    ├─→ matchesSearch()
    ├─→ isInRange()
    ├─→ isInDateRange()
    └─→ parseDate()

salesController.js (Request Handlers)
├─→ handleGetSalesData()
│   └─→ Call salesService.getSalesData()
│
└─→ handleGetFilterOptions()
    └─→ Call salesService.getFilterOptions()

salesRoutes.js (API Endpoints)
├─→ GET /api/sales
└─→ GET /api/filter-options

index.js (Server Setup)
├─→ Express app configuration
├─→ CORS middleware
├─→ Load CSV data on startup
└─→ Listen on port 5151
```

## Data Processing Pipeline

```
Input: CSV File (truestate_assignment_dataset.csv)
    │
    ▼
createReadStream() → csv-parser
    │
    ├─→ Each row parsed as Object
    │   {
    │     "Transaction ID": "...",
    │     "Date": "2024-01-15",
    │     "Customer Name": "John Smith",
    │     "Phone Number": "555-0101",
    │     "Gender": "Male",
    │     "Age": "35",
    │     ...
    │   }
    │
    ▼
Limit to 1000 records
    │
    ▼
Store in salesData (in-memory cache)
    │
    ▼
For Each Request:
    │
    ├─→ [Step 1] Search Filter
    │   └─→ Match against Customer Name OR Phone Number
    │
    ├─→ [Step 2] Multi-select/Range Filters
    │   ├─→ Customer Region filter
    │   ├─→ Gender filter
    │   ├─→ Age Range filter
    │   ├─→ Product Category filter
    │   ├─→ Tags filter
    │   ├─→ Payment Method filter
    │   └─→ Date Range filter
    │
    ├─→ [Step 3] Sorting
    │   └─→ Sort by Date/Quantity/Name (asc or desc)
    │
    └─→ [Step 4] Pagination
        └─→ Slice [startIdx:endIdx]
            
Output: JSON { data: [...], pagination: {...} }
```

## State Management

### Frontend (React Hooks)

```
SalesManagement.jsx
├─→ useState(salesData) - Current page records
├─→ useState(pagination) - Pagination metadata
├─→ useState(filters) - Active filters
├─→ useState(sorting) - Sort options
├─→ useState(currentPage) - Current page number
├─→ useState(loading) - Loading state
├─→ useState(error) - Error messages
└─→ useState(options) - Filter dropdown values
    
useSalesData.js (Custom Hook)
├─→ Encapsulates fetch logic
├─→ Manages loading/error states
├─→ Constructs query parameters
└─→ Triggers API calls on dependency changes
```

### Backend (In-Memory)

```
salesService.js
├─→ let salesData = [] (in-memory store)
│   └─→ 1000 CSV records
│
├─→ let isLoading = false (flag)
│   └─→ Prevent concurrent loading
│
└─→ Caching logic
    └─→ Return cached data on subsequent requests
```

## Performance Considerations

1. **CSV Streaming**: Uses stream-based parsing instead of loading entire file
2. **Record Limit**: Only 1000 records loaded (configurable)
3. **In-Memory Cache**: Eliminates repeated file reads
4. **Pagination**: 10 records per page reduces rendering overhead
5. **Lazy Filtering**: All operations done server-side before pagination
6. **Debounced Search**: Frontend debounces search input (optional)
7. **Vite HMR**: Fast development refresh without full reload

## API Contract

### GET /api/sales

**Request:**
```
GET /api/sales?page=1&pageSize=10&search=john&customerRegion=North&sortBy=date&sortOrder=desc
```

**Response:**
```json
{
  "data": [
    {
      "Transaction ID": "001",
      "Date": "2024-01-15",
      "Customer Name": "John Smith",
      "Phone Number": "555-0101",
      "Gender": "Male",
      "Age": "35",
      ...
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pageSize": 10,
    "totalPages": 15
  }
}
```

### GET /api/filter-options

**Response:**
```json
{
  "customerRegions": ["East", "North", "South", "West"],
  "genders": ["Female", "Male"],
  "productCategories": ["Accessories", "Electronics", ...],
  "paymentMethods": ["Cash", "Credit Card", "Debit Card", ...],
  "tags": ["Audio", "Backup", "Cable", ...]
}
```

## Error Handling

```
Frontend
├─→ Network errors: Display error message in UI
├─→ Loading state: Show spinner while fetching
└─→ Empty results: Display "no records found" message

Backend
├─→ CSV parsing errors: Log and reject promise
├─→ Invalid query params: Use defaults
└─→ CORS errors: Handled by CORS middleware
```
