import fs from "fs";
import { createReadStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let salesData = [];
let isLoading = false;

/**
 * Load sales data from CSV file
 */
export const loadSalesData = () => {
  return new Promise((resolve, reject) => {
    if (salesData.length > 0) {
      console.log(`Using cached data with ${salesData.length} records`);
      return resolve(salesData);
    }

    if (isLoading) {
      // Wait for ongoing loading to complete
      const checkInterval = setInterval(() => {
        if (!isLoading) {
          clearInterval(checkInterval);
          resolve(salesData);
        }
      }, 100);
      return;
    }

    isLoading = true;
    console.log("Starting to load CSV data...");
    
    const results = [];
    let recordCount = 0;
    const maxRecords = 1000; // Load only 1000 records
    
    const csvPath = join(__dirname, "../../data/truestate_assignment_dataset.csv");
    
    createReadStream(csvPath)
      .pipe(csv({
        separator: ",",
        mapHeaders: ({ header }) => header.trim(),
      }))
      .on("data", (data) => {
        if (recordCount < maxRecords) {
          // Map CSV fields to expected format
          results.push({
            "Transaction ID": data["Transaction ID"],
            "Date": data["Date"],
            "Customer ID": data["Customer ID"],
            "Customer Name": data["Customer Name"],
            "Phone Number": data["Phone Number"],
            "Gender": data["Gender"],
            "Age": data["Age"],
            "Customer Region": data["Customer Region"],
            "Customer Type": data["Customer Type"],
            "Product ID": data["Product ID"],
            "Product Name": data["Product Name"],
            "Brand": data["Brand"],
            "Product Category": data["Product Category"],
            "Tags": data["Tags"],
            "Quantity": data["Quantity"],
            "Price per Unit": data["Price per Unit"],
            "Discount Percentage": data["Discount Percentage"],
            "Total Amount": data["Total Amount"],
            "Final Amount": data["Final Amount"],
            "Payment Method": data["Payment Method"],
            "Order Status": data["Order Status"],
            "Delivery Type": data["Delivery Type"],
            "Store ID": data["Store ID"],
            "Store Location": data["Store Location"],
            "Salesperson ID": data["Salesperson ID"],
            "Employee Name": data["Employee Name"],
            id: recordCount + 1,
            price: parseFloat(data["Price per Unit"]) || 0,
            quantity: parseInt(data["Quantity"]) || 0,
            total_amount: parseFloat(data["Total Amount"]) || 0,
          });
          recordCount++;
        }
      })
      .on("end", () => {
        salesData = results;
        isLoading = false;
        console.log(`Successfully loaded ${salesData.length} sales records from CSV`);
        resolve(salesData);
      })
      .on("error", (error) => {
        isLoading = false;
        console.error("Error loading CSV data:", error);
        reject(error);
      });
  });
};

/**
 * Parse date string to Date object
 */
const parseDate = (dateStr) => {
  try {
    return new Date(dateStr);
  } catch {
    return null;
  }
};

/**
 * Check if a value matches the search query
 */
const matchesSearch = (value, query) => {
  if (!value) return false;
  return String(value).toLowerCase().includes(query.toLowerCase());
};

/**
 * Check if a value is within a range
 */
const isInRange = (value, min, max) => {
  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  const hasMin = min !== undefined && min !== null && min !== "";
  const hasMax = max !== undefined && max !== null && max !== "";

  if (hasMin && hasMax) {
    return numValue >= Number(min) && numValue <= Number(max);
  } else if (hasMin) {
    return numValue >= Number(min);
  } else if (hasMax) {
    return numValue <= Number(max);
  }
  return true;
};

/**
 * Check if a date is within a date range
 */
const isInDateRange = (dateStr, startDate, endDate) => {
  const date = parseDate(dateStr);
  if (!date) return false;

  const hasStart =
    startDate !== undefined && startDate !== null && startDate !== "";
  const hasEnd = endDate !== undefined && endDate !== null && endDate !== "";

  if (hasStart && hasEnd) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  } else if (hasStart) {
    const start = new Date(startDate);
    return date >= start;
  } else if (hasEnd) {
    const end = new Date(endDate);
    return date <= end;
  }
  return true;
};

/**
 * Apply search filter
 */
const applySearch = (data, search) => {
  if (!search) return data;

  return data.filter(
    (item) =>
      matchesSearch(item["Customer Name"], search) ||
      matchesSearch(item["Phone Number"], search)
  );
};

/**
 * Apply filters
 */
const applyFilters = (data, filters) => {
  let filtered = [...data];

  // Customer Region filter
  if (filters.customerRegion && filters.customerRegion.length > 0) {
    filtered = filtered.filter((item) =>
      filters.customerRegion.includes(item["Customer Region"])
    );
  }

  // Gender filter
  if (filters.gender && filters.gender.length > 0) {
    filtered = filtered.filter((item) =>
      filters.gender.includes(item["Gender"])
    );
  }

  // Age Range filter
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
    filtered = filtered.filter((item) =>
      isInRange(item["Age"], filters.ageMin, filters.ageMax)
    );
  }

  // Product Category filter
  if (filters.productCategory && filters.productCategory.length > 0) {
    filtered = filtered.filter((item) =>
      filters.productCategory.includes(item["Product Category"])
    );
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((item) => {
      const itemTags = item["Tags"]
        ? item["Tags"].split(",").map((t) => t.trim())
        : [];
      return filters.tags.some((tag) => itemTags.includes(tag));
    });
  }

  // Payment Method filter
  if (filters.paymentMethod && filters.paymentMethod.length > 0) {
    filtered = filtered.filter((item) =>
      filters.paymentMethod.includes(item["Payment Method"])
    );
  }

  // Date Range filter
  if (filters.dateStart || filters.dateEnd) {
    filtered = filtered.filter((item) =>
      isInDateRange(item["Date"], filters.dateStart, filters.dateEnd)
    );
  }

  return filtered;
};

/**
 * Apply sorting
 */
const applySorting = (data, sortBy, sortOrder = "asc") => {
  if (!sortBy) return data;

  const sorted = [...data].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "date":
        aValue = parseDate(a["Date"]);
        bValue = parseDate(b["Date"]);
        break;
      case "quantity":
        aValue = Number(a["Quantity"]) || 0;
        bValue = Number(b["Quantity"]) || 0;
        break;
      case "customerName":
        aValue = (a["Customer Name"] || "").toLowerCase();
        bValue = (b["Customer Name"] || "").toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Apply pagination
 */
const applyPagination = (data, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      total: data.length,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(data.length / pageSize),
    },
  };
};

/**
 * Get unique filter values from dataset
 */
export const getFilterOptions = async () => {
  if (salesData.length === 0) {
    await loadSalesData();
  }

  const customerRegions = [
    ...new Set(
      salesData.map((item) => item["Customer Region"]).filter(Boolean)
    ),
  ];
  const genders = [
    ...new Set(salesData.map((item) => item["Gender"]).filter(Boolean)),
  ];
  const productCategories = [
    ...new Set(
      salesData.map((item) => item["Product Category"]).filter(Boolean)
    ),
  ];
  const paymentMethods = [
    ...new Set(salesData.map((item) => item["Payment Method"]).filter(Boolean)),
  ];

  // Extract unique tags
  const tagsSet = new Set();
  salesData.forEach((item) => {
    if (item["Tags"]) {
      const tags = item["Tags"].split(",").map((t) => t.trim());
      tags.forEach((tag) => tagsSet.add(tag));
    }
  });
  const tags = [...tagsSet].filter(Boolean);

  return {
    customerRegions: customerRegions.sort(),
    genders: genders.sort(),
    productCategories: productCategories.sort(),
    paymentMethods: paymentMethods.sort(),
    tags: tags.sort(),
  };
};

/**
 * Main service function to get sales data with search, filter, sort, and pagination
 */
export const getSalesData = async (queryParams) => {
  if (salesData.length === 0) {
    await loadSalesData();
  }

  const {
    search,
    customerRegion,
    gender,
    ageMin,
    ageMax,
    productCategory,
    tags,
    paymentMethod,
    dateStart,
    dateEnd,
    sortBy,
    sortOrder,
    page,
    pageSize,
  } = queryParams;

  // Parse pagination params with defaults
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(pageSize) || 10;

  // Build filters object
  const filters = {
    customerRegion: customerRegion
      ? Array.isArray(customerRegion)
        ? customerRegion
        : [customerRegion]
      : [],
    gender: gender ? (Array.isArray(gender) ? gender : [gender]) : [],
    ageMin,
    ageMax,
    productCategory: productCategory
      ? Array.isArray(productCategory)
        ? productCategory
        : [productCategory]
      : [],
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    paymentMethod: paymentMethod
      ? Array.isArray(paymentMethod)
        ? paymentMethod
        : [paymentMethod]
      : [],
    dateStart,
    dateEnd,
  };

  // Apply operations in sequence
  let processedData = [...salesData];

  // 1. Apply search
  processedData = applySearch(processedData, search);

  // 2. Apply filters
  processedData = applyFilters(processedData, filters);

  // 3. Apply sorting
  processedData = applySorting(processedData, sortBy, sortOrder);

  // 4. Apply pagination
  const result = applyPagination(processedData, currentPage, itemsPerPage);

  return result;
};