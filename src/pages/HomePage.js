import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'SARI', label: 'শাড়ি Sari', emoji: '🥻' },
  { key: 'CHURI', label: 'চুড়ি Churi', emoji: '💍' },
  { key: 'NECK_CHAIN', label: 'নেকলেস Neck Chain', emoji: '📿' },
  { key: 'OTHER', label: 'Others', emoji: '🎁' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">কুন্দকলি</h1>
        <p className="hero-subtitle">
          Handcrafted saris, churis, neck chains and more — made with love by local artisans of Bangladesh.
        </p>
        <Link to="/products" className="btn-primary" style={{ display: 'inline-block' }}>
          Shop All Products
        </Link>
      </div>

      {/* Categories */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid #e0dcd6', padding: '32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={`/products?category=${cat.key}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '24px 16px', background: '#faf8f5', border: '0.5px solid #e0dcd6',
                  textAlign: 'center', transition: 'all 0.2s', borderRadius: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#8b1a1a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e0dcd6'}
              >
                <span style={{ fontSize: 40, marginBottom: 10 }}>{cat.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8b1a1a' }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Loading products…</p>
        ) : featured.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>No products yet. Check back soon!</p>
        ) : (
          <div className="products-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Handmade banner */}
      <div style={{ background: '#8b1a1a', color: '#fff', padding: '48px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'serif', fontSize: 32, marginBottom: 14 }}>100% Handmade with Love ❤️</h2>
        <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Every piece in our store is hand-crafted by skilled artisans from Bangladesh. No factories, no machines — just heart and craft.
        </p>
        <Link to="/about" className="btn-outline" style={{ color: '#fff', borderColor: '#fff', display: 'inline-block' }}>
          Learn Our Story
        </Link>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: '#aaa', padding: '32px', textAlign: 'center', fontSize: 13 }}>
        <p style={{ marginBottom: 8 }}>© 2026 কুন্দকলি Kundokoli · Made with ❤️ in Bangladesh</p>
        <p>Handcrafted saris, churis, neck chains & more</p>
      </footer>
    </div>
  );
}
