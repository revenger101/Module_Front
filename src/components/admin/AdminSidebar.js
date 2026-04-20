import { NavLink } from 'react-router-dom';

const items = [
  { to: '/admin/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', label: 'Dashboard' },
  { to: '/admin/products', icon: 'M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25', label: 'Products' },
  { to: '/admin/users', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Users' },
  { to: '/admin/admins', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Admins' },
  { to: '/admin/categories', icon: 'M4 6h16M4 12h16M4 18h7', label: 'Categories' },
  { to: '/admin/suppliers', icon: 'M3 21h18M5 21V7l8-4 8 4v14', label: 'Suppliers' }
];

function AdminSidebar({ username }) {
  return (
    <aside className="pro-admin-sidebar">
      <div className="pro-sidebar-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        TuniShop
      </div>
      <nav className="pro-sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `pro-nav-item${isActive ? ' active' : ''}`}
          >
            <svg className="pro-nav-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {item.icon.split(' ').map((d, i) => <path key={i} d={d} />)}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>
      {username && (
        <div className="pro-sidebar-user">
          <div className="pro-user-info">
            <div className="pro-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{username}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Administrator</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default AdminSidebar;
