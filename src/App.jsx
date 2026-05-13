import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import './pages/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">EventBook</Link>

        <div className="navbar-menu">
          {user ? (
            <div className="navbar-user">
              <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
              <span className="navbar-username">Hi, {user.name}</span>
              <button onClick={logout} className="navbar-logout">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register">
                <button className="btn btn-primary">Sign Up</button>
              </Link>
            </>
          )}
        </div>
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