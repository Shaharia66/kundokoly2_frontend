import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getReviews, addReview } from '../api/api';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [reviewForm, setReviewForm] = useState({ reviewerName: '', reviewerEmail: '', comment: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getProductById(id), getReviews(id)])
      .then(([prodRes, revRes]) => {
        setProduct(prodRes.data);
        setReviews(revRes.data);
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setToast(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewerName || !reviewForm.reviewerEmail || !reviewForm.comment) {
      setToast('Please fill in all review fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await addReview(reviewForm, id);
      setReviews((prev) => [res.data, ...prev]);
      setReviewForm({ reviewerName: '', reviewerEmail: '', comment: '', rating: 5 });
      setToast('Review submitted! Thank you.');
    } catch {
      setToast('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return <p style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading…</p>;
  if (!product) return null;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Product section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 60 }}>
        {/* Image */}
        <div style={{ background: '#f0ece7', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, overflow: 'hidden' }}>
          {product.imageUrl
            ? <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 80 }}>🥻</span>
          }
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
              {product.category?.replace('_', ' ')} · Handmade
            </p>
            <h1 style={{ fontFamily: 'serif', fontSize: 36, fontWeight: 600, marginBottom: 10 }}>{product.name}</h1>
            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Stars rating={Math.round(Number(avgRating))} />
                <span style={{ fontSize: 13, color: '#888' }}>{avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}
            <p style={{ fontFamily: 'serif', fontSize: 32, color: '#8b1a1a' }}>৳ {product.price?.toLocaleString()}</p>
          </div>

          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ccc', borderRadius: 4 }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ width: 36, height: 40, border: 'none', background: 'none', fontSize: 18, color: '#555' }}>−</button>
              <span style={{ width: 40, textAlign: 'center', fontSize: 15 }}>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}
                style={{ width: 36, height: 40, border: 'none', background: 'none', fontSize: 18, color: '#555' }}>+</button>
            </div>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          <div style={{ borderTop: '0.5px solid #e0dcd6', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span>✅</span>
              <span style={{ fontSize: 13, color: '#555' }}>100% handmade by local artisans</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span>🚚</span>
              <span style={{ fontSize: 13, color: '#555' }}>Free delivery across Bangladesh over ৳2,000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🔄</span>
              <span style={{ fontSize: 13, color: '#555' }}>30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div style={{ borderTop: '0.5px solid #e0dcd6', paddingTop: 40 }}>
        <h2 style={{ fontFamily: 'serif', fontSize: 26, marginBottom: 28 }}>Customer Reviews</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {/* Existing reviews */}
          <div>
            {reviews.length === 0 ? (
              <p style={{ color: '#888', fontSize: 14 }}>No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="review-card">
                  <div className="review-header">
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{r.reviewerName}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{r.comment}</p>
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>
                    {new Date(r.createdAt).toLocaleDateString('en-BD')}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Review form */}
          <div>
            <h3 style={{ fontFamily: 'serif', fontSize: 20, marginBottom: 18, color: '#8b1a1a' }}>Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" placeholder="Fatima Begum" value={reviewForm.reviewerName}
                  onChange={e => setReviewForm(f => ({ ...f, reviewerName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="fatima@email.com" value={reviewForm.reviewerEmail}
                  onChange={e => setReviewForm(f => ({ ...f, reviewerEmail: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Rating *</label>
                <select value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{'⭐'.repeat(n)} ({n}/5)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment *</label>
                <textarea rows={4} placeholder="Share your experience with this product…" value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ color: n <= rating ? '#8b1a1a' : '#ddd' }}>★</span>
      ))}
    </div>
  );
}
