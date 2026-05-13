import { useState, useEffect } from 'react';
import api from '../api/axios';
import './MyBookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/mine')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading your bookings...</div>;

  return (
    <div className="my-bookings">
      <div className="container">
        <h1 className="my-bookings-title">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bookings-empty">
            <p>No bookings yet. Start exploring events!</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3 className="booking-event-title">{booking.event?.title}</h3>
                <div className="booking-event-meta">
                  📅 {new Date(booking.event?.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })} · 📍 {booking.event?.venue?.name}
                </div>
                <div className="booking-details">
                  {booking.ticketType} × {booking.quantity} · ₹{booking.totalAmount.toLocaleString()}
                </div>
              </div>

              <div className="booking-actions">
                <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'}`}>
                  {booking.status}
                </span>
                <button
                  onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                  className="show-qr-button"
                >
                  {expandedId === booking._id ? '🔼 Hide QR Codes' : '🔽 Show QR Codes'}
                </button>
              </div>

              {expandedId === booking._id && (
                <div className="qr-codes-container">
                  {booking.tickets?.map(ticket => (
                    <div key={ticket._id} className="qr-code-item">
                      <img 
                        src={ticket.qrCodeUrl} 
                        alt="QR Code"
                        className="qr-code-image"
                      />
                      <div className="qr-code-label">
                        {ticket.ticketCode.slice(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}