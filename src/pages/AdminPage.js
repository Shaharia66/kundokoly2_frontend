import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getProducts, deleteProduct, createProduct, updateProduct,
  getAllOrders, updateOrderStatus, deleteOrder
} from '../api/api';
import Toast from '../components/Toast';

const TABS = ['Products', 'Orders'];
const CATEGORIES = ['SARI', 'CHURI', 'NECK_CHAIN', 'OTHER'];

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'SARI', stockQuantity: '' });

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
    loadProducts();
    loadOrders();
  }, [isAdmin]);

  const loadProducts = () => getProducts().then(r => setProducts(r.data)).catch(console.error);
  const loadOrders = () => getAllOrders().then(r => setOrders(r.data)).catch(console.error);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', category: 'SARI', stockQuantity: '' });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stockQuantity: p.stockQuantity });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', parseFloat(form.price));
      fd.append('category', form.category);
      fd.append('stockQuantity', parseInt(form.stockQuantity) || 0);
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await updateProduct(editing.id, fd);
        setToast('Product updated!');
      } else {
        await createProduct(fd);
        setToast('Product created!');
      }
      setShowModal(false);
      loadProducts();
    } catch {
      setToast('Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this cancelled order?')) return;
    try {
      await deleteOrder(id);
      setToast('Order deleted.');
      loadOrders();
    } catch {
      setToast('Failed to delete order.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setToast('Product deleted.');
      loadProducts();
    } catch {
      setToast('Failed to delete.');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setToast('Order status updated.');
      loadOrders();
    } catch {
      setToast('Failed to update status.');
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'serif', fontSize: 30, color: '#8b1a1a' }}>Admin Dashboard</h1>
        {tab === 'Products' && (
          <button className="btn-primary" onClick={openCreate}>+ Add Product</button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Products', value: products.length },
          { label: 'Total Orders', value: orders.length },
          { label: 'Pending Orders', value: orders.filter(o => o.status === 'PENDING').length },
          { label: 'Revenue', value: '৳ ' + orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.totalAmount, 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '0.5px solid #e0dcd6', padding: '20px 16px', borderRadius: 4 }}>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'serif', fontSize: 28, color: '#8b1a1a' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '0.5px solid #e0dcd6', marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '10px 24px', background: 'none', border: 'none', fontSize: 13,
              fontWeight: 500, letterSpacing: '0.08em', cursor: 'pointer',
              borderBottom: tab === t ? '2px solid #8b1a1a' : '2px solid transparent',
              color: tab === t ? '#8b1a1a' : '#888',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Products table */}
      {tab === 'Products' && (
        <div style={{ background: '#fff', border: '0.5px solid #e0dcd6', borderRadius: 4, overflow: 'hidden' }}>
          {products.length === 0 ? (
            <p style={{ padding: 40, textAlign: 'center', color: '#888' }}>No products yet. Click "+ Add Product" to start.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} style={{ width: 48, height: 60, objectFit: 'cover', borderRadius: 2 }} />
                        : <span style={{ fontSize: 28 }}>🥻</span>
                      }
                    </td>
                    <td><strong>{p.name}</strong></td>
                    <td><span style={{ fontSize: 11, background: '#f5f0ea', padding: '3px 8px', borderRadius: 10 }}>{p.category}</span></td>
                    <td style={{ fontFamily: 'serif' }}>৳ {p.price?.toLocaleString()}</td>
                    <td>{p.stockQuantity ?? 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)}
                          style={{ padding: '6px 14px', background: 'none', border: '0.5px solid #ccc', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Orders table */}
      {tab === 'Orders' && (
        <div style={{ background: '#fff', border: '0.5px solid #e0dcd6', borderRadius: 4, overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <p style={{ padding: 40, textAlign: 'center', color: '#888' }}>No orders yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Phone</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{o.customerName}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{o.customerEmail}</div>
                      <div style={{ fontSize: 11, color: '#666', maxWidth: 160 }}>{o.deliveryAddress}</div>
                    </td>
                    <td>{o.customerPhone}</td>
                    <td style={{ fontSize: 12 }}>{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontFamily: 'serif', color: '#8b1a1a' }}>৳ {o.totalAmount?.toLocaleString()}</td>
                    <td style={{ fontSize: 11 }}>{o.paymentMethod?.replace('_', ' ')}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          style={{ padding: '5px 8px', border: '0.5px solid #ccc', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}
                        >
                          {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {o.status === 'CANCELLED' && (
                          <button
                            className="btn-danger"
                            onClick={() => handleDeleteOrder(o.id)}
                            style={{ fontSize: 11, padding: '4px 10px' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Product modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Product Name *</label>
                <input placeholder="e.g. Jamdani Sari" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea rows={4} placeholder="Describe the product…" value={form.description} onChange={set('description')} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Price (৳) *</label>
                  <input type="number" min="0" step="0.01" placeholder="2500" value={form.price} onChange={set('price')} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Stock Quantity</label>
                  <input type="number" min="0" placeholder="10" value={form.stockQuantity} onChange={set('stockQuantity')} />
                </div>
              </div>
              <div style={{ height: 16 }} />
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={set('category')}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Product Image {editing ? '(leave blank to keep existing)' : ''}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                  style={{ padding: '8px 0', border: 'none', fontSize: 13 }} />
              </div>
              {editing?.imageUrl && !imageFile && (
                <div style={{ marginBottom: 16 }}>
                  <img src={editing.imageUrl} alt="current"
                    style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 2 }} />
                  <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Current image</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}