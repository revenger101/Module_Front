import { useCallback, useEffect, useState } from 'react';
import { adminRequest } from './adminApi';

function AdminDashboardPage({ session, onUnauthorized, setGlobalLoading, notify, activities }) {
  const [kpis, setKpis] = useState({ admins: 0, categories: 0, suppliers: 0, products: 0 });

  const loadKpis = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const [admins, categories, suppliers, productsPage] = await Promise.all([
        adminRequest('/admins', session, onUnauthorized),
        adminRequest('/categories', session, onUnauthorized),
        adminRequest('/suppliers', session, onUnauthorized),
        adminRequest('/products?page=0&size=1', session, onUnauthorized)
      ]);

      setKpis({
        admins: admins?.length || 0,
        categories: categories?.length || 0,
        suppliers: suppliers?.length || 0,
        products: productsPage?.totalElements || 0
      });
      notify('success', 'Dashboard KPIs refreshed', false);
    } catch (error) {
      notify('error', error.message, false);
    } finally {
      setGlobalLoading(false);
    }
  }, [session, onUnauthorized, notify, setGlobalLoading]);

  useEffect(() => {
    loadKpis();
  }, [loadKpis]);

  return (
    <div className="pro-dashboard-grid">
      <div className="pro-kpi-card">
        <div className="pro-kpi-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <p className="pro-kpi-label">Total Admins</p>
        <p className="pro-kpi-value">{kpis.admins}</p>
      </div>

      <div className="pro-kpi-card">
        <div className="pro-kpi-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"></path></svg>
        </div>
        <p className="pro-kpi-label">Categories</p>
        <p className="pro-kpi-value">{kpis.categories}</p>
      </div>

      <div className="pro-kpi-card">
        <div className="pro-kpi-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        </div>
        <p className="pro-kpi-label">Suppliers</p>
        <p className="pro-kpi-value">{kpis.suppliers}</p>
      </div>

      <div className="pro-kpi-card">
        <div className="pro-kpi-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </div>
        <p className="pro-kpi-label">Total Products</p>
        <p className="pro-kpi-value">{kpis.products}</p>
      </div>

      <div className="pro-activity-section">
        <div className="pro-activity-header">
          <h2>Recent Activity</h2>
          <button className="pro-header-btn" type="button" onClick={loadKpis}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh
          </button>
        </div>
        {activities.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No activity yet. Actions from the back office will appear here.</p>
        ) : (
          <ul className="pro-activity-list">
            {activities.slice(0, 12).map((item) => (
              <li className="pro-activity-item" key={item.id}>
                <span className="pro-activity-message">{item.message}</span>
                <time className="pro-activity-time">{item.at}</time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
