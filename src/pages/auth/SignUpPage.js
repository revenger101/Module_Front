import { Link } from 'react-router-dom';
import './AuthPages.css'; // Import the new premium styling

function SignUpPage({ form, onFormChange, onSubmit, loading, status, theme, onToggleTheme }) {
  return (
    <div className="pro-auth-container" data-theme={theme}>
      {/* Left Splash Side */}
      <div className="pro-auth-left">
        <div>
          <div className="pro-auth-brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>TuniShop</span>
          </div>
        </div>
        <div className="pro-auth-quote">
          <h2>Start your premium journey today.</h2>
          <p>Create an account to browse thousands of high-quality products, experience lightning-fast checkout, and receive personalized offers.</p>
        </div>
        <div style={{ zIndex: 1, marginTop: '20px' }}>
          <button 
            type="button" 
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            onClick={onToggleTheme}
          >
            Switch to {theme === 'night' ? 'Light' : 'Night'} Theme
          </button>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="pro-auth-right">
        <div className="pro-auth-form-wrapper">
          <div className="pro-auth-header">
            <h1>Create an account</h1>
            <p>Join TuniShop to get started.</p>
          </div>

          <div className="pro-social-logins">
            <button className="social-btn" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.66-2.26 1.05-3.71 1.05-2.87 0-5.3-1.94-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.06c-.22-.66-.35-1.36-.35-2.06s.13-1.4.35-2.06V7.1H2.16C1.45 8.52 1.05 10.2 1.05 12s.4 3.48 1.11 4.9l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.1l3.68 2.84c.86-2.59 3.29-4.56 6.16-4.56z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="social-btn" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.8 1.45-.1 2.86.37 3.86 1.25-2.7 1.65-2.31 5.37.52 6.64-1.07 2.37-2.06 4.14-3.04 5.08zm-1.89-13.43c-.45 2.15-2.63 3.65-4.47 3.51.14-2.19 1.6-4.14 3.73-4.66.36 1.15.74.88.74 1.15z"/></svg>
              Apple
            </button>
          </div>

          <div className="pro-divider">
            <span>or create an account with email</span>
          </div>

          <form className="pro-form" onSubmit={onSubmit}>
            <div className="pro-input-group">
              <label>Username</label>
              <input
                placeholder="Choose a username"
                value={form.username}
                onChange={(event) => onFormChange((prev) => ({ ...prev, username: event.target.value }))}
                required
              />
            </div>
            <div className="pro-input-group">
              <label>Email</label>
              <input
                placeholder="Enter your email"
                type="email"
                value={form.email}
                onChange={(event) => onFormChange((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </div>
            <div className="pro-input-group">
              <label>Password</label>
              <input
                placeholder="Choose a strong password"
                type="password"
                value={form.password}
                onChange={(event) => onFormChange((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </div>

            <button type="submit" className="pro-submit-btn signup" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="pro-status" aria-live="polite">{status}</p>

          <p className="pro-auth-footer">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
