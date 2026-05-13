import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './EventList.css';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="event-list">
      <div className="container">
        <div className="event-list-header">
          <h1 className="event-list-title">Discover Events</h1>
          <p className="event-list-subtitle">Find and book amazing events happening near you</p>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-muted">No events available.</p>
        ) : (
          <div className="event-grid">
            {events.map(event => {
              const minPrice = Math.min(...event.ticketTypes.map(t => t.price));
              const totalSeats = event.ticketTypes.reduce((sum, t) => sum + t.totalSeats, 0);
              const bookedSeats = event.ticketTypes.reduce((sum, t) => sum + t.bookedSeats, 0);
              const available = totalSeats - bookedSeats;

              return (
                <Link key={event._id} to={`/events/${event._id}`} className="event-card">
                  <div className="event-card-image">
                    <span className="event-card-category">{event.category}</span>
                  </div>
                  <div className="event-card-content">
                    <h3 className="event-card-title">{event.title}</h3>
                    <div className="event-card-date">
                      <span>📅</span>
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="event-card-location">
                      <span>📍</span>
                      <span>{event.venue.name}</span>
                    </div>
                    <div className="event-card-footer">
                      <div>
                        <div className="event-card-price">₹{minPrice.toLocaleString()}</div>
                        <div className="event-card-organizer">{available} seats left</div>
                      </div>
                      <span className="badge badge-info">{event.status}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}