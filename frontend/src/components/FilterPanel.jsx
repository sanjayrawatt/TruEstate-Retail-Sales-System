import React, { useState } from "react";
import "../styles/FilterPanel.css";

const FilterPanel = ({ filters, options, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleMultiSelectChange = (filterName, value) => {
    const currentValues = filters[filterName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({ [filterName]: newValues });
  };

  const handleInputChange = (filterName, value) => {
    onFilterChange({ [filterName]: value });
  };

  return (
    <div className={`filter-panel ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="filter-brand">
        <div className="brand-logo">T</div>
        {isExpanded && <span className="brand-name">TruEstate</span>}
      </div>
      
      <div className="filter-header">
        <h2>{isExpanded ? "🎯 Filters" : "🎯"}</h2>
        <button
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Collapse filters" : "Expand filters"}
        >
          {isExpanded ? "◀" : "▶"}
        </button>
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Customer Region */}
          <div className="filter-group">
            <h3>🌍 Customer Region</h3>
            <div className="checkbox-group">
              {(options.customerRegions || []).map((region) => (
                <label key={region} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.customerRegion.includes(region)}
                    onChange={() =>
                      handleMultiSelectChange("customerRegion", region)
                    }
                  />
                  {region}
                </label>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="filter-group">
            <h3>👤 Gender</h3>
            <div className="checkbox-group">
              {(options.genders || []).map((gender) => (
                <label key={gender} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.gender.includes(gender)}
                    onChange={() => handleMultiSelectChange("gender", gender)}
                  />
                  {gender}
                </label>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="filter-group">
            <h3>🎂 Age Range</h3>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.ageMin}
                onChange={(e) => handleInputChange("ageMin", e.target.value)}
                className="range-input"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.ageMax}
                onChange={(e) => handleInputChange("ageMax", e.target.value)}
                className="range-input"
              />
            </div>
          </div>

          {/* Product Category */}
          <div className="filter-group">
            <h3>📦 Product Category</h3>
            <div className="checkbox-group scrollable">
              {(options.productCategories || []).map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.productCategory.includes(category)}
                    onChange={() =>
                      handleMultiSelectChange("productCategory", category)
                    }
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="filter-group">
            <h3>🏷️ Tags</h3>
            <div className="checkbox-group scrollable">
              {(options.tags || []).map((tag) => (
                <label key={tag} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleMultiSelectChange("tags", tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="filter-group">
            <h3>💳 Payment Method</h3>
            <div className="checkbox-group">
              {(options.paymentMethods || []).map((method) => (
                <label key={method} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.paymentMethod.includes(method)}
                    onChange={() =>
                      handleMultiSelectChange("paymentMethod", method)
                    }
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="filter-group">
            <h3>📅 Date Range</h3>
            <div className="date-inputs">
              <input
                type="date"
                value={filters.dateStart}
                onChange={(e) => handleInputChange("dateStart", e.target.value)}
                className="date-input"
              />
              <span>to</span>
              <input
                type="date"
                value={filters.dateEnd}
                onChange={(e) => handleInputChange("dateEnd", e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
