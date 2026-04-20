import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

function AdminLayout({ session, loading, onLogout, theme, onToggleTheme }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <header className="hero">
          <div>
            <p className="eyebrow">Control Center</p>
            <h1>Admin Back Office</h1>
            <p className="muted">Signed in as {session.user.username}. Manage your catalog and users.</p>
          </div>
          <div className="hero-actions">
            {loading && <span className="status-chip">Syncing...</span>}
            <button type="button" className="theme-toggle" onClick={onToggleTheme}>
              {theme === 'night' ? 'Aurora Theme' : 'Night Theme'}
            </button>
            <button type="button" onClick={onLogout}>Sign Out</button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
