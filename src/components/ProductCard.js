import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CATEGORY_EMOJI = { SARI: '🥻', CHURI: '💍', NECK_CHAIN: '📿', OTHER: '🎁' };

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-card-img">
        {product.imageUrl
          ? <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} />
          : <span style={{ fontSize: 52 }}>{CATEGORY_EMOJI[product.category] || '🎁'}</span>
        }
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-category">{product.category?.replace('_', ' ')}</div>
        <div className="product-card-footer">
          <span className="product-price">৳ {product.price?.toLocaleString()}</span>
          <button className="add-to-cart-btn" onClick={handleAdd} title="Add to cart">+</button>
        </div>
      </div>
    </div>
  );
}
