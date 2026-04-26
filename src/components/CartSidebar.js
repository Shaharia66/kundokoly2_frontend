import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ onClose }) {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', color: '#888' }}>×</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', marginTop: '40px', fontSize: '14px' }}>
              Your cart is empty
            </p>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="cart-item">
                <div className="cart-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                  {product.imageUrl
                    ? <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : categoryEmoji(product.category)
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: 4 }}>{product.name}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: 8 }}>৳ {product.price.toLocaleString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{ width: 24, height: 24, border: '0.5px solid #ccc', background: '#fff', borderRadius: '50%', fontSize: 14 }}>−</button>
                    <span style={{ fontSize: 13, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)}
                      style={{ width: 24, height: 24, border: '0.5px solid #ccc', background: '#fff', borderRadius: '50%', fontSize: 14 }}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'serif', fontSize: 15, marginBottom: 6 }}>৳ {(product.price * quantity).toLocaleString()}</div>
                  <button onClick={() => removeFromCart(product.id)}
                    style={{ fontSize: 11, color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span style={{ color: '#8b1a1a', fontFamily: 'serif' }}>৳ {total.toLocaleString()}</span>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={handleCheckout} disabled={items.length === 0}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function categoryEmoji(cat) {
  const map = { SARI: '🥻', CHURI: '💍', NECK_CHAIN: '📿', OTHER: '🎁' };
  return map[cat] || '🎁';
}
