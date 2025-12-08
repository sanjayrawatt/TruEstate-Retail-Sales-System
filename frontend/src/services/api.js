import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get sales data
 */
export const getSalesData = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/sales`, { params });
  return response.data;
};

/**
 * Get filter options
 */
export const getFilterOptions = async () => {
  const response = await axios.get(`${API_BASE_URL}/sales/filters`);
  return response.data;
};
