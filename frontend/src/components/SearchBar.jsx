import React from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search customers by name or phone..."
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
        />
        {value && (
          <button
            className="clear-search"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
