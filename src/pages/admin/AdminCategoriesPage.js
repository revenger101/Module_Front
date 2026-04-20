import { useCallback, useEffect, useState } from 'react';
import { adminRequest } from './adminApi';

const defaultCreate = { name: '', description: '' };

function AdminCategoriesPage({ session, onUnauthorized, setGlobalLoading, notify, requestConfirm }) {
  const [categories, setCategories] = useState([]);
  const [createForm, setCreateForm] = useState(defaultCreate);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(defaultCreate);

  const loadCategories = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const data = await adminRequest('/categories', session, onUnauthorized);
      setCategories(data || []);
      notify('success', 'Categories synced');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }, [session, onUnauthorized, setGlobalLoading, notify]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function createCategory(event) {
    event.preventDefault();
    setGlobalLoading(true);
    try {
      await adminRequest('/categories', session, onUnauthorized, { method: 'POST', body: createForm });
      setCreateForm(defaultCreate);
      await loadCategories();
      notify('success', 'Category created');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function saveCategory(event) {
    event.preventDefault();
    if (!editId) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/categories/${editId}`, session, onUnauthorized, { method: 'PUT', body: editForm });
      setEditId(null);
      await loadCategories();
      notify('success', 'Category updated');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function deleteCategory(id) {
    const confirmed = await requestConfirm('Delete this category?', 'This action cannot be undone.');
    if (!confirmed) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/categories/${id}`, session, onUnauthorized, { method: 'DELETE' });
      await loadCategories();
      notify('success', 'Category deleted');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '350px 1fr' }}>
      
      {/* Left side: Create form */}
      <section className="pro-table-wrapper" style={{ padding: '1.5rem', alignSelf: 'start' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Create Category</h2>
        <form onSubmit={createCategory}>
          <div className="pro-form-group">
            <label>Name</label>
            <input
              placeholder="e.g. Headphones"
              value={createForm.name}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="pro-form-group">
            <label>Description</label>
            <textarea
              placeholder="Brief description"
              value={createForm.description}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
              rows="3"
            />
          </div>
          <button type="submit" className="pro-header-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
            Add Category
          </button>
        </form>
      </section>

      {/* Right side: Table */}
      <section className="pro-table-wrapper">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>All Categories</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="pro-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td><span style={{ opacity: 0.6 }}>#{category.id}</span></td>
                  <td>
                    {editId === category.id ? (
                      <div className="pro-form-group" style={{ marginBottom: 0 }}>
                        <input
                          value={editForm.name}
                          onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                          required
                          style={{ padding: '8px 12px' }}
                        />
                      </div>
                    ) : (
                      <strong style={{ fontWeight: 500 }}>{category.name}</strong>
                    )}
                  </td>
                  <td>
                    {editId === category.id ? (
                      <div className="pro-form-group" style={{ marginBottom: 0 }}>
                        <input
                          value={editForm.description}
                          onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
                          style={{ padding: '8px 12px' }}
                        />
                      </div>
                    ) : (
                      <span style={{ opacity: 0.8 }}>{category.description || '-'}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {editId === category.id ? (
                        <>
                          <button type="button" className="pro-header-btn primary" onClick={saveCategory} style={{ padding: '6px 12px' }}>Save</button>
                          <button type="button" className="pro-header-btn" onClick={() => setEditId(null)} style={{ padding: '6px 12px' }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="pro-header-btn"
                            onClick={() => {
                              setEditId(category.id);
                              setEditForm({ name: category.name, description: category.description || '' });
                            }}
                            style={{ padding: '6px 12px' }}
                          >
                            Edit
                          </button>
                          <button type="button" className="pro-header-btn danger" onClick={() => deleteCategory(category.id)} style={{ padding: '6px 12px' }}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminCategoriesPage;
