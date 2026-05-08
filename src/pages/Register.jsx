import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
          <input 
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input 
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
            style={{ width: '100%', padding: '0.5rem', fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>I am a...</label>
          <select 
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: 16 }}
          >
            <option value="user">User (book events)</option>
            <option value="organizer">Organizer (create events)</option>
          </select>
        </div>

        {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}

        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Register
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: 14 }}>
        Have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Login</Link>
      </p>
    </div>
  );
}