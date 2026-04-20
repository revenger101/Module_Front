import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onAddToCart, 
  onToggleCart, 
  cartItemCount, 
  cartTotal 
}) => {
  return (
    <section className="products-section">
      <div className="section-header">
        <h2>Our Collection</h2>
        <button 
          className="cart-toggle-btn pro-btn" 
          onClick={onToggleCart}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Cart ({cartItemCount}) - ${parseFloat(cartTotal).toFixed(2)}
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found matching your criteria.</div>
      ) : (
        <div className="store-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;