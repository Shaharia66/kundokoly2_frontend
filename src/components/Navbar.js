import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">কুন্দকলি</Link>

        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {isAdmin && <li><Link to="/admin" style={{ color: '#8b1a1a', fontWeight: 600 }}>Admin</Link></li>}
        </ul>

        <div className="navbar-right">
          <button className="cart-btn" onClick={() => setCartOpen(true)} title="Cart">
            🛒
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>

          {isAdmin ? (
            <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }}>
              Admin Login
            </Link>
          )}
        </div>
      </nav>

      {cartOpen && <CartSidebar onClose={() => setCartOpen(false)} />}
    </>
  );
}
