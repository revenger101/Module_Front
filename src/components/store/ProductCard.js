import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  // A dynamic badge to highlight premium products
  const isTrending = product.price >= 150; 
  
  return (
    <div className="store-card group">
      <div className="store-card-image-wrapper">
        <div 
          className="store-card-image" 
          style={{ backgroundImage: `url(${product.imageUrl || ''})` }}
        >
          {!product.imageUrl && <div className="placeholder-img">No Image Available</div>}
        </div>
        
        {isTrending && <span className="product-badge">Top Rated</span>}
        
        <button className="wishlist-btn" title="Add to Wishlist">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        
        {/* Quick Add Overlay on Hover */}
        <div className="quick-add-overlay">
          <button 
            className="quick-add-btn"
            onClick={() => onAddToCart(product.id)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Quick Add
          </button>
        </div>
      </div>

      <div className="store-card-content">
        <div className="store-card-meta">
          <span className="product-category">{product.category?.name || 'Accessories'}</span>
          <span className="product-rating">4.8</span>
        </div>
        
        <h3 className="store-card-title" title={product.name}>{product.name}</h3>
        <p className="store-card-desc">{product.description}</p>
        
        <div className="store-card-footer">
          <div className="price-tag">{parseFloat(product.price).toFixed(2)}</div>
          <button 
            className="premium-add-btn"
            onClick={() => onAddToCart(product.id)}
          >
            <span>Add</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;