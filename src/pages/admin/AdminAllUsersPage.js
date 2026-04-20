import { useCallback, useEffect, useState } from 'react';
import { adminRequest } from './adminApi';

function AdminAllUsersPage({ session, onUnauthorized, setGlobalLoading, notify }) {
  const [users, setUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const data = await adminRequest('/users', session, onUnauthorized);
      setUsers(data || []);
      notify('success', 'Users synced');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }, [session, onUnauthorized, setGlobalLoading, notify]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <section className="card">
      <h2>All Users</h2>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.enabled ? 'Enabled' : 'Disabled'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminAllUsersPage;
