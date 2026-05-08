import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Upcoming Events</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {events.map(event => (
          <Link 
            key={event._id} 
            to={`/events/${event._id}`}
            style={{ 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{ padding: '1rem' }}>
              <h3>{event.title}</h3>
              <p style={{ color: '#666', fontSize: 14 }}>
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p style={{ color: '#666', fontSize: 14 }}>
                {event.venue.name}
              </p>
              <p style={{ color: '#4f46e5', fontWeight: 600, marginTop: '0.5rem' }}>
                From ₹{Math.min(...event.ticketTypes.map(t => t.price))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}