import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminPages.css';

function AdminLayout({ session, loading, onLogout, theme, onToggleTheme }) {
  return (
    <div className="pro-admin-container" data-theme={theme}>
      <AdminSidebar username={session.user.username} />
      <div className="pro-admin-main">
        <header className="pro-admin-header">
          <div>
            <h1>Overview</h1>
            <p>Welcome back, {session.user.username}. Here is what's happening today.</p>
          </div>
          <div className="pro-header-actions">
            {loading && <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Syncing...</span>}
            <button type="button" className="pro-header-btn" onClick={onToggleTheme}>
               <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              {theme === 'night' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button type="button" className="pro-header-btn danger" onClick={onLogout}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>
        </header>

        <main className="pro-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
