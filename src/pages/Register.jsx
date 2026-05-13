import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              className="form-input"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select 
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="form-input"
            >
              <option value="user">User (Book events)</option>
              <option value="organizer">Organizer (Create events)</option>
            </select>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
}