import { useState, useEffect } from 'react';
import { getSalesData, getFilterOptions } from '../services/api';

export const useSalesData = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    customerRegion: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateStart: '',
    dateEnd: ''
  });
  
  const [sorting, setSorting] = useState({
    sortBy: '',
    sortOrder: 'asc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch data based on current filters, sorting, and pagination
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        ...sorting,
        page: currentPage,
        pageSize: pagination.pageSize
      };
      
      const result = await getSalesData(params);
      
      // Ensure result has proper structure
      if (result && result.data && result.pagination) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        setData([]);
        setPagination({
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setData([]);
      setPagination({
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when filters, sorting, or page changes
  useEffect(() => {
    fetchData();
  }, [filters, sorting, currentPage]);
  
  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Update sorting
  const updateSorting = (sortBy, sortOrder = 'asc') => {
    setSorting({ sortBy, sortOrder });
    setCurrentPage(1); // Reset to first page when sorting changes
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      customerRegion: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      productCategory: [],
      tags: [],
      paymentMethod: [],
      dateStart: '',
      dateEnd: ''
    });
    setCurrentPage(1);
  };
  
  return {
    data,
    pagination,
    loading,
    error,
    filters,
    sorting,
    currentPage,
    setCurrentPage,
    updateFilters,
    updateSorting,
    clearFilters
  };
};

export const useFilterOptions = () => {
  const [options, setOptions] = useState({
    customerRegions: [],
    genders: [],
    productCategories: [],
    paymentMethods: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const data = await getFilterOptions();
        setOptions(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch filter options');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  return { options, loading, error };
};
