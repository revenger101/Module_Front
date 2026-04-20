import { useCallback, useEffect, useState } from 'react';
import { adminRequest } from './adminApi';

const defaultCreate = { username: '', email: '', password: '' };
const defaultEdit = { username: '', email: '' };

function AdminUsersPage({ session, onUnauthorized, setGlobalLoading, notify, requestConfirm }) {
  const [admins, setAdmins] = useState([]);
  const [createForm, setCreateForm] = useState(defaultCreate);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(defaultEdit);

  const loadAdmins = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const adminsData = await adminRequest('/admins', session, onUnauthorized);
      setAdmins(adminsData || []);
      notify('success', 'Admins synced');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }, [session, onUnauthorized, setGlobalLoading, notify]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  async function createAdmin(event) {
    event.preventDefault();
    setGlobalLoading(true);
    try {
      await adminRequest('/admins', session, onUnauthorized, { method: 'POST', body: createForm });
      setCreateForm(defaultCreate);
      await loadAdmins();
      notify('success', 'Admin created');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function updateAdmin(event) {
    event.preventDefault();
    if (!editId) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/admins/${editId}`, session, onUnauthorized, { method: 'PUT', body: editForm });
      setEditId(null);
      await loadAdmins();
      notify('success', 'Admin updated');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function deleteAdmin(id) {
    const confirmed = await requestConfirm('Delete this admin?', 'This action cannot be undone.');
    if (!confirmed) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/admins/${id}`, session, onUnauthorized, { method: 'DELETE' });
      await loadAdmins();
      notify('success', 'Admin deleted');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Admins</h2>
      <form className="stack" onSubmit={createAdmin}>
        <input
          placeholder="Username"
          value={createForm.username}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, username: event.target.value }))}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={createForm.email}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={createForm.password}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
        <button type="submit">Add Admin</button>
      </form>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>
                  {editId === admin.id ? (
                    <input
                      value={editForm.username}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, username: event.target.value }))}
                      required
                    />
                  ) : admin.username}
                </td>
                <td>
                  {editId === admin.id ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  ) : admin.email}
                </td>
                <td>
                  <div className="inline-actions">
                    {editId === admin.id ? (
                      <>
                        <button type="button" onClick={updateAdmin}>Save</button>
                        <button type="button" className="ghost" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => {
                            setEditId(admin.id);
                            setEditForm({ username: admin.username, email: admin.email });
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => deleteAdmin(admin.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminUsersPage;
