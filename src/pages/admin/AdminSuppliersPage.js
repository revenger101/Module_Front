import { useCallback, useEffect, useState } from 'react';
import { adminRequest } from './adminApi';

const defaultCreate = { name: '', contactEmail: '', phone: '', imageUrl: '' };

function AdminSuppliersPage({ session, onUnauthorized, setGlobalLoading, notify, requestConfirm }) {
  const [suppliers, setSuppliers] = useState([]);
  const [createForm, setCreateForm] = useState(defaultCreate);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(defaultCreate);

  const loadSuppliers = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const data = await adminRequest('/suppliers', session, onUnauthorized);
      setSuppliers(data || []);
      notify('success', 'Suppliers synced');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }, [session, onUnauthorized, setGlobalLoading, notify]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  async function createSupplier(event) {
    event.preventDefault();
    setGlobalLoading(true);
    try {
      await adminRequest('/suppliers', session, onUnauthorized, { method: 'POST', body: createForm });
      setCreateForm(defaultCreate);
      await loadSuppliers();
      notify('success', 'Supplier created');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function saveSupplier(event) {
    event.preventDefault();
    if (!editId) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/suppliers/${editId}`, session, onUnauthorized, { method: 'PUT', body: editForm });
      setEditId(null);
      await loadSuppliers();
      notify('success', 'Supplier updated');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function deleteSupplier(id) {
    const confirmed = await requestConfirm('Delete this supplier?', 'This action cannot be undone.');
    if (!confirmed) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/suppliers/${id}`, session, onUnauthorized, { method: 'DELETE' });
      await loadSuppliers();
      notify('success', 'Supplier deleted');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Suppliers</h2>
      <form className="stack" onSubmit={createSupplier}>
        <input
          placeholder="Supplier name"
          value={createForm.name}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <input
          placeholder="Contact email"
          type="email"
          value={createForm.contactEmail}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
          required
        />
        <input
          placeholder="Phone"
          value={createForm.phone}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, phone: event.target.value }))}
        />
        <input
          placeholder="Image URL"
          value={createForm.imageUrl}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
        />
        <button type="submit">Add Supplier</button>
      </form>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td>
                  {editId === supplier.id ? (
                    <input
                      value={editForm.imageUrl}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                    />
                  ) : (
                    <img className="table-thumb" src={supplier.imageUrl || 'https://via.placeholder.com/72x48?text=No+Image'} alt={supplier.name} />
                  )}
                </td>
                <td>
                  {editId === supplier.id ? (
                    <input
                      value={editForm.name}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  ) : supplier.name}
                </td>
                <td>
                  {editId === supplier.id ? (
                    <input
                      type="email"
                      value={editForm.contactEmail}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
                      required
                    />
                  ) : supplier.contactEmail}
                </td>
                <td>
                  {editId === supplier.id ? (
                    <input
                      value={editForm.phone}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))}
                    />
                  ) : (supplier.phone || '-')}
                </td>
                <td>
                  <div className="inline-actions">
                    {editId === supplier.id ? (
                      <>
                        <button type="button" onClick={saveSupplier}>Save</button>
                        <button type="button" className="ghost" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => {
                            setEditId(supplier.id);
                            setEditForm({
                              name: supplier.name,
                              contactEmail: supplier.contactEmail,
                              phone: supplier.phone || '',
                              imageUrl: supplier.imageUrl || ''
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => deleteSupplier(supplier.id)}>Delete</button>
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

export default AdminSuppliersPage;
