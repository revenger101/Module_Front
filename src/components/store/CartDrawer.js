import React from 'react';

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartData, 
  cartTotal, 
  onUpdateQuantity, 
  onClearCart 
}) => {
  if (!isOpen) return null;

  return (
    <div className="cart-drawer glass-panel">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      
      <div className="cart-items">
        {(!cartData || !cartData.lignes || cartData.lignes.length === 0) ? (
          <div className="empty-cart-state">
            <svg width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>Your cart is empty.</p>
            <button className="pro-btn secondary-btn" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          cartData.lignes.map(line => (
            <div key={line.id} className="cart-item">
              <div 
                className="cart-item-image" 
                style={{ backgroundImage: `url(${line.product.imageUrl || ''})` }}
              >
                {!line.product.imageUrl && <span className="no-img-text">No Img</span>}
              </div>
              
              <div className="cart-item-details">
                <div className="cart-item-header-row">
                  <h4 className="cart-item-title" title={line.product.name}>{line.product.name}</h4>
                  <button 
                    className="remove-item-btn" 
                    onClick={() => onUpdateQuantity(line.product.id, 0)}
                    title="Remove item"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="cart-item-bottom-row">
                  <div className="cart-item-price">
                    ${parseFloat(line.product.price).toFixed(2)}
                  </div>
                  <div className="cart-item-stepper">
                    <button onClick={() => onUpdateQuantity(line.product.id, line.quantity - 1)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span>{line.quantity}</span>
                    <button onClick={() => onUpdateQuantity(line.product.id, line.quantity + 1)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {(cartData && cartData.lignes && cartData.lignes.length > 0) && (
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="cart-checkout-actions">
            <button className="clear-btn" onClick={onClearCart}>Clear Cart</button>
            <button className="checkout-btn pro-btn primary-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;