import React, { useMemo } from "react";
import { useSalesData, useFilterOptions } from "../hooks/useSalesData";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import SortingDropdown from "./SortingDropdown";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";
import "../styles/SalesManagement.css";

const SalesManagement = () => {
  const {
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
    clearFilters,
  } = useSalesData();

  const { options } = useFilterOptions();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = data.reduce(
      (sum, item) => sum + (parseFloat(item["Final Amount"]) || 0),
      0
    );
    const totalOrders = pagination.total;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalQuantity = data.reduce(
      (sum, item) => sum + (parseInt(item["Quantity"]) || 0),
      0
    );

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      avgOrderValue: avgOrderValue.toFixed(2),
      totalQuantity,
    };
  }, [data, pagination.total]);

  return (
    <div className="sales-management">
      <div className="main-layout">
        <FilterPanel
          filters={filters}
          options={options}
          onFilterChange={updateFilters}
        />
        
        <div className="content-area">
          <header className="header">
            <div className="header-content">
              <div className="header-left">
                <div className="brand-text">
                  <h1 className="main-title">Sales Dashboard</h1>
                  <p className="subtitle">Retail Sales Management System</p>
                </div>
              </div>
              <div className="user-profile">
                <div className="user-avatar">SSR</div>
              </div>
            </div>
          </header>

          {/* Statistics Cards */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">${stats.totalRevenue}</p>
                <span className="stat-label">From {stats.totalOrders} orders</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
                <span className="stat-label">All transactions</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Avg Order Value</h3>
                <p className="stat-value">${stats.avgOrderValue}</p>
                <span className="stat-label">Per transaction</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛍️</div>
              <div className="stat-content">
                <h3>Items Sold</h3>
                <p className="stat-value">{stats.totalQuantity}</p>
                <span className="stat-label">Total quantity</span>
              </div>
            </div>
          </div>

          <div className="controls-section">
            <SearchBar
              value={filters.search}
              onChange={(search) => updateFilters({ search })}
            />

            <SortingDropdown
              sortBy={sorting.sortBy}
              sortOrder={sorting.sortOrder}
              onSortChange={updateSorting}
            />

            <button className="clear-btn" onClick={clearFilters}>
              🔄 Clear All Filters
            </button>
          </div>

          <div className="main-content">
            <div className="data-section">
              {error && <div className="error-message">⚠️ Error: {error}</div>}

              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading data...</p>
                </div>
              ) : (
                <>
                  <div className="results-header">
                    <div className="results-info">
                      📋 Showing <strong>{data.length}</strong> of{" "}
                      <strong>{pagination.total}</strong> results
                    </div>
                  </div>

                  <TransactionTable data={data} />

                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;
