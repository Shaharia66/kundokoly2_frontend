import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">About কুন্দকলি</h1>
        <p className="hero-subtitle">Made by hand, given with love — our story from Dhaka to your home.</p>
      </div>

      <div className="section" style={{ maxWidth: 900 }}>
        {/* Story */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'serif', fontSize: 30, marginBottom: 16, color: '#8b1a1a' }}>Our Story</h2>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 14 }}>
              Kundokoli was born in 2021 in a small studio in Dhanmondi, Dhaka. We started with a simple belief — that traditional Bangladeshi craftsmanship deserves to be celebrated and shared with the world.
            </p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 14 }}>
              Every sari we sell is hand-woven. Every churi is hand-formed. Every neck chain is hand-threaded. Our artisans — mostly women from local communities — pour their heart and skill into every single piece.
            </p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9 }}>
              No factories. No machines. Just tradition, talent, and love.
            </p>
          </div>
          <div style={{ background: '#f0ece7', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 80 }}>
            🧵
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 60 }}>
          {[
            { num: '50+', label: 'Unique designs' },
            { num: '100%', label: 'Handmade' },
            { num: '6', label: 'Local artisans' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '0.5px solid #e0dcd6', padding: '28px 20px', textAlign: 'center', borderRadius: 4 }}>
              <div style={{ fontFamily: 'serif', fontSize: 40, color: '#8b1a1a', marginBottom: 8 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Products info */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'serif', fontSize: 28, marginBottom: 24, color: '#8b1a1a' }}>Our Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { emoji: '🥻', title: 'শাড়ি Sari', desc: 'Hand-woven saris in muslin, silk, and cotton. Each one takes 3–7 days to complete and tells its own story through colour and pattern.' },
              { emoji: '💍', title: 'চুড়ি Churi', desc: 'Glass, lac, and metal bangles — hand-crafted and hand-painted. Perfect for every occasion from everyday wear to weddings.' },
              { emoji: '📿', title: 'নেকলেস Neck Chain', desc: 'Traditional and contemporary neck chains using beads, silver, and gold-fill wire. Each piece is hand-strung and individually finished.' },
              { emoji: '🎁', title: 'Other Crafts', desc: 'Handmade earrings, hair accessories, and decorative pieces — all crafted by our skilled team using locally sourced materials.' },
            ].map(p => (
              <div key={p.title} style={{ background: '#fff', border: '0.5px solid #e0dcd6', padding: '24px 20px', borderRadius: 4 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{p.emoji}</div>
                <h3 style={{ fontFamily: 'serif', fontSize: 18, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ background: '#8b1a1a', color: '#fff', padding: 36, borderRadius: 4, marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'serif', fontSize: 26, marginBottom: 20 }}>Our Values</h2>
          {[
            { icon: '🌿', title: 'Slow Fashion', text: 'We make in small batches — never over-producing, always intentional.' },
            { icon: '💰', title: 'Fair Pay', text: 'Every artisan at Kundokoli earns above market rate. We believe good craft deserves good pay.' },
            { icon: '♻️', title: 'Natural Materials', text: 'We prioritize locally sourced, natural, and eco-friendly materials wherever possible.' },
          ].map(v => (
            <div key={v.title} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{v.icon}</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6 }}>{v.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/products" className="btn-primary" style={{ display: 'inline-block' }}>Shop Our Collection</Link>
        </div>
      </div>
    </div>
  );
}
