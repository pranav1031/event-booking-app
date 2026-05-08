import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/bookings/mine')
      .then(({ data }) => setBookings(data));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p style={{ color: '#666' }}>No bookings yet.</p>
      ) : (
        bookings.map(booking => (
          <div 
            key={booking._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >
            <h3>{booking.event?.title}</h3>
            <p style={{ fontSize: 14, color: '#666' }}>
              {new Date(booking.event?.date).toLocaleDateString()} · {booking.event?.venue?.name}
            </p>
            <p>
              {booking.ticketType} × {booking.quantity} · ₹{booking.totalAmount}
            </p>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              background: booking.status === 'confirmed' ? '#d1fae5' : '#fee2e2',
              color: booking.status === 'confirmed' ? '#065f46' : '#991b1b',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600
            }}>
              {booking.status}
            </span>

            <button
              onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
              style={{
                marginLeft: '1rem',
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              {expandedId === booking._id ? 'Hide QR' : 'Show QR Codes'}
            </button>

            {expandedId === booking._id && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {booking.tickets?.map(ticket => (
                  <div key={ticket._id} style={{ textAlign: 'center' }}>
                    <img 
                      src={ticket.qrCodeUrl} 
                      alt="QR Code"
                      style={{ width: 150, height: 150, border: '1px solid #ddd' }}
                    />
                    <p style={{ fontSize: 10, fontFamily: 'monospace', marginTop: '0.5rem' }}>
                      {ticket.ticketCode.slice(0, 8)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}