import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      background: 'white', 
      borderBottom: '1px solid #ddd', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: '#4f46e5', textDecoration: 'none' }}>
        EventBook
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/my-bookings" style={{ textDecoration: 'none', color: '#333' }}>
              My Bookings
            </Link>
            <span>Hi, {user.name}</span>
            <button 
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
            <Link to="/register">
              <button style={{
                padding: '0.5rem 1rem',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}>
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;