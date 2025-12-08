import axios from "axios";

const API_BASE_URL = "/api";

/**
 * Get sales data with filters, search, sorting, and pagination
 */
export const getSalesData = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

/**
 * Get available filter options
 */
export const getFilterOptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales/filters`);
    return response.data;
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw error;
  }
};
