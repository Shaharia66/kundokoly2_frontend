import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/api';

const PAYMENT_METHODS = ['BKASH', 'NAGAD', 'CASH_ON_DELIVERY'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    deliveryAddress: '', city: '', postalCode: '',
    paymentMethod: 'BKASH', transactionId: '',
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  if (items.length === 0 && !orderPlaced) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ fontSize: 18, color: '#888', marginBottom: 20 }}>Your cart is empty.</p>
        <button className="btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto', textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontFamily: 'serif', fontSize: 28, color: '#8b1a1a', marginBottom: 12 }}>Order Placed!</h2>
        <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 8 }}>
          Thank you, <strong>{orderPlaced.customerName}</strong>! Your order #{orderPlaced.id} has been received.
        </p>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>
          We will contact you at <strong>{orderPlaced.customerPhone}</strong> to confirm your order.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.deliveryAddress) {
      alert('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      };
      const res = await placeOrder(payload);
      clearCart();
      setOrderPlaced(res.data);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
      <h1 style={{ fontFamily: 'serif', fontSize: 32, marginBottom: 32, color: '#8b1a1a' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40 }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <h2 style={{ fontFamily: 'serif', fontSize: 20, marginBottom: 20 }}>Your Information</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Full Name *</label>
              <input placeholder="Fatima Begum" value={form.customerName} onChange={set('customerName')} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Phone Number *</label>
              <input placeholder="+880 1700 000 000" value={form.customerPhone} onChange={set('customerPhone')} required />
            </div>
          </div>
          <div style={{ height: 16 }} />
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" placeholder="fatima@email.com" value={form.customerEmail} onChange={set('customerEmail')} required />
          </div>
          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea rows={3} placeholder="House #, Road #, Area…" value={form.deliveryAddress} onChange={set('deliveryAddress')} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>City</label>
              <input placeholder="Dhaka" value={form.city} onChange={set('city')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Postal Code</label>
              <input placeholder="1207" value={form.postalCode} onChange={set('postalCode')} />
            </div>
          </div>

          <div style={{ height: 28 }} />
          <h2 style={{ fontFamily: 'serif', fontSize: 20, marginBottom: 20 }}>Payment Method</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {PAYMENT_METHODS.map(method => (
              <label key={method} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                border: `1px solid ${form.paymentMethod === method ? '#8b1a1a' : '#e0dcd6'}`,
                cursor: 'pointer', borderRadius: 4,
                background: form.paymentMethod === method ? '#fdf5f5' : '#fff',
              }}>
                <input type="radio" name="payment" value={method}
                  checked={form.paymentMethod === method}
                  onChange={set('paymentMethod')}
                  style={{ accentColor: '#8b1a1a' }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {method === 'BKASH' ? '🟣 bKash' : method === 'NAGAD' ? '🟠 Nagad' : '💵 Cash on Delivery'}
                </span>
              </label>
            ))}
          </div>

          {form.paymentMethod !== 'CASH_ON_DELIVERY' && (
            <div className="form-group">
              <label>Transaction ID</label>
              <input placeholder="Enter your bKash/Nagad transaction ID" value={form.transactionId} onChange={set('transactionId')} />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8, padding: '14px' }} disabled={submitting}>
            {submitting ? 'Placing Order…' : `Place Order · ৳ ${total.toLocaleString()}`}
          </button>
        </form>

        {/* Order summary */}
        <div style={{ background: '#fff', border: '0.5px solid #e0dcd6', padding: 24, height: 'fit-content', borderRadius: 4 }}>
          <h2 style={{ fontFamily: 'serif', fontSize: 20, marginBottom: 20 }}>Order Summary</h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 13 }}>
              <div>
                <div style={{ fontWeight: 500 }}>{product.name}</div>
                <div style={{ color: '#888' }}>× {quantity}</div>
              </div>
              <div style={{ fontFamily: 'serif', fontSize: 15 }}>৳ {(product.price * quantity).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ borderTop: '0.5px solid #e0dcd6', paddingTop: 14, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#888' }}>
              <span>Subtotal</span><span>৳ {total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#888' }}>
              <span>Delivery</span>
              <span style={{ color: total >= 2000 ? '#2ecc71' : '#1a1a1a' }}>
                {total >= 2000 ? 'Free' : '৳ 80'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, paddingTop: 8, borderTop: '0.5px solid #e0dcd6' }}>
              <span>Total</span>
              <span style={{ color: '#8b1a1a', fontFamily: 'serif', fontSize: 20 }}>
                ৳ {(total < 2000 ? total + 80 : total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
