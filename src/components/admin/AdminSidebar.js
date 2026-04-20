import { NavLink } from 'react-router-dom';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/admins', label: 'Admins' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/suppliers', label: 'Suppliers' }
];

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Back Office</h2>
      <nav>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
