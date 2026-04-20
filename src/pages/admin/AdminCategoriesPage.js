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
    <section className="card">
      <h2>Categories</h2>
      <form className="stack" onSubmit={createCategory}>
        <input
          placeholder="Category name"
          value={createForm.name}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <input
          placeholder="Description"
          value={createForm.description}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <button type="submit">Add Category</button>
      </form>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  {editId === category.id ? (
                    <input
                      value={editForm.name}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  ) : category.name}
                </td>
                <td>
                  {editId === category.id ? (
                    <input
                      value={editForm.description}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
                    />
                  ) : (category.description || '-')} 
                </td>
                <td>
                  <div className="inline-actions">
                    {editId === category.id ? (
                      <>
                        <button type="button" onClick={saveCategory}>Save</button>
                        <button type="button" className="ghost" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => {
                            setEditId(category.id);
                            setEditForm({ name: category.name, description: category.description || '' });
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => deleteCategory(category.id)}>Delete</button>
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

export default AdminCategoriesPage;
