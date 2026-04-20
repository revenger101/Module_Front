import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client';
import HeroSection from '../../components/store/HeroSection';
import FiltersSidebar from '../../components/store/FiltersSidebar';
import ProductGrid from '../../components/store/ProductGrid';
import CartDrawer from '../../components/store/CartDrawer';
import { notifyAdminCheckout } from '../../utils/emailService';
import './StorefrontPage.css';

const StorefrontPage = ({ session, onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth / Toast State
  const [showLoginToast, setShowLoginToast] = useState(false);

  // Cart state from backend
  const [cartData, setCartData] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    q: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.q) {
        params.append('q', filters.q.trim());
      }
      const data = await apiRequest('/public/products?' + params.toString(), {
        auth: false
      });
      // Handle Spring Data Page<T> response
      let finalData = data.content ? data.content : (Array.isArray(data) ? data : []);
      
      // Optionally filter locally if needed for minPrice/maxPrice
      if (filters.minPrice) finalData = finalData.filter(p => p.price >= parseFloat(filters.minPrice));
      if (filters.maxPrice) finalData = finalData.filter(p => p.price <= parseFloat(filters.maxPrice));
      
      setProducts(finalData);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    // Only attempt if user is likely logged in (has token)
    if (!session?.token) return;
    
    try {
      const data = await apiRequest('/cart', { token: session.token });
      setCartData(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!session?.token) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 5000);
      return;
    }
    try {
      const updatedCart = await apiRequest('/cart/items', {
        method: 'POST',
        body: { productId, quantity },
        token: session.token
      });
      setCartData(updatedCart);
      setIsCartOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const updatedCart = await apiRequest('/cart/items', {
        method: 'PUT',
        body: { productId, quantity: newQuantity },
        token: session.token
      });
      setCartData(updatedCart);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!session?.token) return;
    try {
      await apiRequest('/cart', { method: 'DELETE', token: session.token });
      setCartData(null);
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (!session?.user) return;
    
    // Trigger the alert on the website
    window.alert('Checkout initiated! An email notification has been sent.');
    
    // Close cart automatically
    setIsCartOpen(false);
    
    // Send background EmailJS notification
    await notifyAdminCheckout(session.user, cartTotal);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  // Calculate cart totals
  const cartItemCount = cartData?.lignes?.reduce((sum, line) => sum + line.quantity, 0) || 0;
  const cartTotal = cartData?.lignes?.reduce((sum, line) => sum + (line.product.price * line.quantity), 0) || 0;

  return (
    <div className="store-container">
      {/* Global Storefront Header */}
      <header className="store-header">
        <div className="brand" onClick={() => navigate('/store')}>LUMINA</div>
        
        <div className="header-actions">
          {session ? (
            <div className="auth-profile" onClick={onLogout} title="Click to Sign Out">
              <div className="auth-avatar">
                {session?.user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="auth-name">{session?.user?.username}</span>
            </div>
          ) : (
            <button className="header-login-btn" onClick={() => navigate('/signin')}>
              Log In
            </button>
          )}
        </div>
      </header>

      <HeroSection />

      <div className="store-main">
        <FiltersSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onSearch={handleSearch} 
        />

        <ProductGrid 
          products={products}
          loading={loading}
          error={error}
          onAddToCart={addToCart}
          onToggleCart={() => setIsCartOpen(!isCartOpen)}
          cartItemCount={cartItemCount}
          cartTotal={cartTotal}
        />
      </div>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartData={cartData}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />

      {/* Stunning Login Required Toast */}
      {showLoginToast && (
        <div className="login-toast">
          <div className="toast-content">
            <div className="toast-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
            </div>
            <div className="toast-text">
              <h4>Authentication Required</h4>
              <p>Please log in to add items to your cart.</p>
            </div>
            <button 
              className="toast-login-btn"
              onClick={() => {
                localStorage.removeItem('tp_auth_session');
                localStorage.removeItem('token');
                window.location.href = '/signin';
              }}
            >
              Log In
            </button>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}
    </div>
  );
};

export default StorefrontPage;