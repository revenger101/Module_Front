import React from 'react';

const FiltersSidebar = ({ filters, onFilterChange, onSearch }) => {
  const handleClear = () => {
    // We can simulate an event or just call onFilterChange properly, but since the parent expects an event `e.target.name/value`, we can clear in the parent if we want.
    // For now, let's just trigger empty values
    onFilterChange({ target: { name: 'q', value: '' } });
    onFilterChange({ target: { name: 'minPrice', value: '' } });
    onFilterChange({ target: { name: 'maxPrice', value: '' } });
  };

  return (
    <aside className="filters-sidebar glass-panel">
      <div className="filter-header">
        <h2>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{marginRight: '0.5rem', verticalAlign: 'middle'}}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
        </h2>
        <button type="button" className="clear-filters-btn" onClick={handleClear}>Clear</button>
      </div>
      
      <form onSubmit={onSearch} className="filter-form">
        <div className="input-group search-group">
          <label>Search Keyword</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={onFilterChange}
              placeholder="e.g. Headphones"
            />
          </div>
        </div>

        <div className="price-range-group">
          <label>Price Range ($)</label>
          <div className="price-inputs">
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={onFilterChange}
                placeholder="Min"
                min="0"
              />
            </div>
            <span className="price-separator">-</span>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={onFilterChange}
                placeholder="Max"
                min="0"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="pro-btn apply-filters-btn">
          View Results
        </button>
      </form>
    </aside>
  );
};

export default FiltersSidebar;