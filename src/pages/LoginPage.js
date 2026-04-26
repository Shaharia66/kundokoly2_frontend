import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', border: '0.5px solid #e0dcd6', padding: '40px 36px', width: '100%', maxWidth: 400, borderRadius: 4 }}>
        <h1 style={{ fontFamily: 'serif', fontSize: 26, marginBottom: 6, color: '#8b1a1a', textAlign: 'center' }}>Admin Login</h1>
        <p style={{ fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 28 }}>কুন্দকলি Dashboard</p>

        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="admin" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 20 }}>
          Default: admin / admin123 (change after first login)
        </p>
      </div>
    </div>
  );
}
