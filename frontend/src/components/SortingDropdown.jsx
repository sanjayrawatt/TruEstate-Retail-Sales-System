import React from "react";
import "../styles/SortingDropdown.css";

const SortingDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(":");
    onSortChange(field, order);
  };

  const currentValue = `${sortBy}:${sortOrder}`;

  return (
    <div className="sorting-dropdown">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={currentValue}
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="">None</option>
        <option value="date:asc">Date (Oldest First)</option>
        <option value="date:desc">Date (Newest First)</option>
        <option value="quantity:desc">Quantity (High to Low)</option>
        <option value="customerName:asc">Customer Name (A-Z)</option>
        <option value="customerName:desc">Customer Name (Z-A)</option>
      </select>
    </div>
  );
};

export default SortingDropdown;
