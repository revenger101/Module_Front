import React from 'react';

const HeroSection = () => {
  return (
    <div className="store-hero">
      {/* Decorative Orbs */}
      <div className="hero-orb orb-1"></div>
      <div className="hero-orb orb-2"></div>

      <div className="store-hero-container">
        {/* Left Side: Typography & Action */}
        <div className="store-hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span> 
            <span className="badge-text">New Collection 2026</span>
          </div>
          
          <h1 className="hero-title">
            Elevate Your <br />
            <span className="highlight-text">Everyday Style.</span>
          </h1>
          
          <p className="hero-subtitle">
            Discover our meticulously curated collection of premium products, 
            designed to seamlessly blend elegance and functionality into your modern lifestyle.
          </p>
          
          <div className="hero-actions">
            <button className="pro-actions-btn hero-primary-btn">
              Explore Catalog
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{marginLeft: '0.5rem'}}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="pro-actions-btn hero-secondary-btn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem'}}>
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Watch Video
            </button>
          </div>

          <div className="hero-trust">
            <div className="avatar-group">
              <img src="https://i.pravatar.cc/100?img=33" alt="customer" />
              <img src="https://i.pravatar.cc/100?img=47" alt="customer" />
              <img src="https://i.pravatar.cc/100?img=12" alt="customer" />
              <div className="avatar-more">+2k</div>
            </div>
            <div className="trust-text">
              <div className="stars">★★★★★</div>
              <span>From happy customers</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="store-hero-visual">
          <div className="visual-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Headphones" 
              className="hero-main-image"
            />
            
            {/* Absolute Floating Glass Card */}
            <div className="floating-card glass-panel bounce-anim">
              <div className="card-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="#2c5364" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <div className="card-floating-info">
                <span className="card-float-title">Premium Quality</span>
                <span className="card-float-desc">100% Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;