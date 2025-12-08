import { getSalesData, getFilterOptions } from '../services/salesService.js';

/**
 * Get sales data with search, filter, sort, and pagination
 */
export const getSales = async (req, res) => {
  try {
    console.log('GET /api/sales - Query params:', req.query);
    const result = await getSalesData(req.query);
    console.log('Sending response:', { dataCount: result.data.length, pagination: result.pagination });
    res.json(result);
  } catch (error) {
    console.error('Error in getSales controller:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * Get filter options for dropdowns
 */
export const getFilters = async (req, res) => {
  try {
    console.log('GET /api/sales/filters');
    const options = await getFilterOptions();
    console.log('Filter options:', options);
    res.json(options);
  } catch (error) {
    console.error('Error in getFilters controller:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
