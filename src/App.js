import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './index.css';

export default function App() {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    fetch('https://kundokoly2-backend.onrender.com/health')
      .then(() => setBackendReady(true))
      .catch(() => setBackendReady(true));
  }, []);

  if (!backendReady) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '20px'
      }}>
        <p>⏳ Please wait...</p>
        <p style={{ fontSize: '14px', color: 'gray' }}>
          Server is waking up, this may take 30-60 seconds
        </p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}