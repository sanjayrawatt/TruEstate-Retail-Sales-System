import React, { useMemo, useState } from "react";
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

  // Calculate statistics from total data (not just current page)
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalQuantity = 0;
    
    // For now, approximate stats based on pagination.total and current data
    // Better approach: get all filtered data for stats
    if (data && data.length > 0) {
      totalRevenue = data.reduce(
        (sum, item) => sum + (parseFloat(item.finalAmount) || 0),
        0
      );
      totalQuantity = data.reduce(
        (sum, item) => sum + (parseInt(item.quantity) || 0),
        0
      );
    }
    
    // Scale up stats to represent all filtered results
    const totalOrders = pagination.total;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / data.length) * totalOrders : 0;

    return {
      totalRevenue: (totalRevenue / data.length * totalOrders || 0).toFixed(2),
      totalOrders,
      avgOrderValue: avgOrderValue.toFixed(2),
      totalQuantity: (totalQuantity / data.length * totalOrders || 0),
    };
  }, [data, pagination.total]);

  return (
    <div className="sales-management">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="truestate-logo">
              <span className="logo-icon">T</span>
              <span className="logo-text">TueEstate</span>
            </div>
          </div>
          <div className="header-center">
            <h1>📊 Sales Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="user-avatar">SSR</div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <FilterPanel
            filters={filters}
            options={options}
            onFilterChange={updateFilters}
          />
        </aside>

        <main className="main-area">

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

        </main>
      </div>
    </div>
  );
};

export default SalesManagement;
