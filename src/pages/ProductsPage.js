import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['ALL', 'SARI', 'CHURI', 'NECK_CHAIN', 'OTHER'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const activeCategory = searchParams.get('category') || 'ALL';

  const fetchProducts = () => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'ALL') params.category = activeCategory;
    if (search.trim()) params.search = search.trim();
    getProducts(params)
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const setCategory = (cat) => {
    if (cat === 'ALL') searchParams.delete('category');
    else setSearchParams({ category: cat });
  };

  return (
    <div>
      <div className="hero" style={{ padding: '40px 32px' }}>
        <h1 className="hero-title" style={{ fontSize: 36 }}>All Products</h1>
        <p className="hero-subtitle" style={{ fontSize: 14, marginBottom: 20 }}>
          Handcrafted with love — browse our full collection
        </p>
        <form onSubmit={handleSearch} className="search-bar" style={{ maxWidth: 500, margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      <div className="section">
        <div className="category-filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Loading…</p>
        ) : products.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>No products found.</p>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
