import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminRequest } from './adminApi';

const defaultCreate = {
  name: '',
  description: '',
  imageUrl: '',
  price: '',
  quantityInStock: '',
  categoryId: '',
  supplierId: ''
};

function toPayload(form) {
  return {
    ...form,
    price: Number(form.price),
    quantityInStock: Number(form.quantityInStock),
    categoryId: Number(form.categoryId),
    supplierId: Number(form.supplierId)
  };
}

function AdminProductsPage({ session, onUnauthorized, setGlobalLoading, notify, requestConfirm }) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productsPage, setProductsPage] = useState({ content: [], number: 0, totalPages: 0 });

  const [createForm, setCreateForm] = useState(defaultCreate);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(defaultCreate);

  const [filters, setFilters] = useState({ q: '', categoryId: '', supplierId: '', size: 8 });

  const categoryOptions = useMemo(
    () => categories.map((item) => ({ value: String(item.id), label: `${item.name} (#${item.id})` })),
    [categories]
  );

  const supplierOptions = useMemo(
    () => suppliers.map((item) => ({ value: String(item.id), label: `${item.name} (#${item.id})` })),
    [suppliers]
  );

  const loadReferences = useCallback(async () => {
    const [categoriesData, suppliersData] = await Promise.all([
      adminRequest('/categories', session, onUnauthorized),
      adminRequest('/suppliers', session, onUnauthorized)
    ]);

    setCategories(categoriesData || []);
    setSuppliers(suppliersData || []);
  }, [session, onUnauthorized]);

  const loadProducts = useCallback(async (targetPage = 0) => {
    const params = new URLSearchParams({ page: String(targetPage), size: String(filters.size) });
    if (filters.q.trim()) params.append('q', filters.q.trim());
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.supplierId) params.append('supplierId', filters.supplierId);

    const data = await adminRequest(`/products?${params.toString()}`, session, onUnauthorized);
    setProductsPage(data);
  }, [filters, session, onUnauthorized]);

  useEffect(() => {
    setGlobalLoading(true);
    Promise.all([loadReferences(), loadProducts()])
      .then(() => notify('success', 'Products synced'))
      .catch((error) => notify('error', error.message))
      .finally(() => setGlobalLoading(false));
  }, [loadReferences, loadProducts, setGlobalLoading, notify]);

  async function createProduct(event) {
    event.preventDefault();
    setGlobalLoading(true);
    try {
      await adminRequest('/products', session, onUnauthorized, {
        method: 'POST',
        body: toPayload(createForm)
      });
      setCreateForm(defaultCreate);
      await loadProducts(0);
      notify('success', 'Product created');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    if (!editId) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/products/${editId}`, session, onUnauthorized, {
        method: 'PUT',
        body: toPayload(editForm)
      });
      setEditId(null);
      await loadProducts(productsPage.number);
      notify('success', 'Product updated');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  async function deleteProduct(id) {
    const confirmed = await requestConfirm('Delete this product?', 'This action cannot be undone.');
    if (!confirmed) return;

    setGlobalLoading(true);
    try {
      await adminRequest(`/products/${id}`, session, onUnauthorized, { method: 'DELETE' });
      await loadProducts(productsPage.number);
      notify('success', 'Product deleted');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setGlobalLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Products</h2>

      <form className="stack product-form" onSubmit={createProduct}>
        <select
          value={createForm.categoryId}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, categoryId: event.target.value }))}
          required
        >
          <option value="">Category</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={createForm.supplierId}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, supplierId: event.target.value }))}
          required
        >
          <option value="">Supplier</option>
          {supplierOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <input
          placeholder="Product name"
          value={createForm.name}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <input
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          value={createForm.price}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, price: event.target.value }))}
          required
        />
        <input
          placeholder="Stock"
          type="number"
          min="0"
          value={createForm.quantityInStock}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, quantityInStock: event.target.value }))}
          required
        />
        <input
          className="product-desc"
          placeholder="Description"
          value={createForm.description}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <input
          className="product-desc"
          placeholder="Image URL"
          value={createForm.imageUrl}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
        />
        <button type="submit">Add Product</button>
      </form>

      <form
        className="filters"
        onSubmit={(event) => {
          event.preventDefault();
          setGlobalLoading(true);
          loadProducts(0)
            .then(() => notify('success', 'Filters applied'))
            .catch((error) => notify('error', error.message))
            .finally(() => setGlobalLoading(false));
        }}
      >
        <input
          placeholder="Search by name or description"
          value={filters.q}
          onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
        />
        <select
          value={filters.categoryId}
          onChange={(event) => setFilters((prev) => ({ ...prev, categoryId: event.target.value }))}
        >
          <option value="">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={filters.supplierId}
          onChange={(event) => setFilters((prev) => ({ ...prev, supplierId: event.target.value }))}
        >
          <option value="">All suppliers</option>
          {supplierOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button type="submit">Apply</button>
      </form>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsPage.content.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {editId === product.id ? (
                    <input
                      value={editForm.imageUrl}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                    />
                  ) : (
                    <img className="table-thumb" src={product.imageUrl || 'https://via.placeholder.com/72x48?text=No+Image'} alt={product.name} />
                  )}
                </td>
                <td>
                  {editId === product.id ? (
                    <input
                      value={editForm.name}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  ) : product.name}
                </td>
                <td>
                  {editId === product.id ? (
                    <input
                      value={editForm.description}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
                    />
                  ) : (product.description || '-')}
                </td>
                <td>
                  {editId === product.id ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.price}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
                      required
                    />
                  ) : `$${Number(product.price).toFixed(2)}`}
                </td>
                <td>
                  {editId === product.id ? (
                    <input
                      type="number"
                      min="0"
                      value={editForm.quantityInStock}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, quantityInStock: event.target.value }))}
                      required
                    />
                  ) : product.quantityInStock}
                </td>
                <td>
                  {editId === product.id ? (
                    <select
                      value={editForm.categoryId}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                      required
                    >
                      <option value="">Category</option>
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : product.category?.name}
                </td>
                <td>
                  {editId === product.id ? (
                    <select
                      value={editForm.supplierId}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, supplierId: event.target.value }))}
                      required
                    >
                      <option value="">Supplier</option>
                      {supplierOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : product.supplier?.name}
                </td>
                <td>
                  <div className="inline-actions">
                    {editId === product.id ? (
                      <>
                        <button type="button" onClick={saveProduct}>Save</button>
                        <button type="button" className="ghost" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => {
                            setEditId(product.id);
                            setEditForm({
                              name: product.name,
                              description: product.description || '',
                              imageUrl: product.imageUrl || '',
                              price: product.price,
                              quantityInStock: product.quantityInStock,
                              categoryId: String(product.category.id),
                              supplierId: String(product.supplier.id)
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => deleteProduct(product.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button
          onClick={() => loadProducts(Math.max(productsPage.number - 1, 0))}
          disabled={productsPage.number <= 0}
        >
          Previous
        </button>
        <span>Page {productsPage.totalPages ? productsPage.number + 1 : 0} / {productsPage.totalPages}</span>
        <button
          onClick={() => loadProducts(Math.min(productsPage.number + 1, Math.max(productsPage.totalPages - 1, 0)))}
          disabled={productsPage.number >= productsPage.totalPages - 1}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default AdminProductsPage;
