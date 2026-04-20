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
    <section className="dashboard-grid">
      <article className="card kpi-card">
        <p className="kpi-label">Admins</p>
        <p className="kpi-value">{kpis.admins}</p>
      </article>
      <article className="card kpi-card">
        <p className="kpi-label">Categories</p>
        <p className="kpi-value">{kpis.categories}</p>
      </article>
      <article className="card kpi-card">
        <p className="kpi-label">Suppliers</p>
        <p className="kpi-value">{kpis.suppliers}</p>
      </article>
      <article className="card kpi-card">
        <p className="kpi-label">Products</p>
        <p className="kpi-value">{kpis.products}</p>
      </article>

      <section className="card dashboard-activity">
        <div className="dashboard-head">
          <h2>Recent Activity</h2>
          <button type="button" onClick={loadKpis}>Refresh</button>
        </div>
        {activities.length === 0 ? (
          <p className="muted">No activity yet. Actions from the back office will appear here.</p>
        ) : (
          <ul className="activity-list">
            {activities.slice(0, 12).map((item) => (
              <li key={item.id}>
                <span>{item.message}</span>
                <time>{item.at}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

export default AdminDashboardPage;
