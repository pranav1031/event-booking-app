import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => setEvent(data));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    
    setLoading(true);
    try {
      await api.post('/bookings', {
        eventId: id,
        ticketType: selectedTier.name,
        quantity
      });
      alert('🎉 Booking successful! Check your email for QR codes.');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="loading">Loading event...</div>;

  return (
    <div className="event-detail">
      <div className="container">
        <div className="event-detail-header">
          <h1 className="event-detail-title">{event.title}</h1>
          <div className="event-detail-meta">
            <div className="event-detail-date">
              <span className="event-detail-icon">📅</span>
              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}</span>
            </div>
            <div className="event-detail-location">
              <span className="event-detail-icon">📍</span>
              <span>{event.venue.name}, {event.venue.address}</span>
            </div>
          </div>
        </div>

        <div className="event-detail-section">
          <h2 className="event-detail-section-title">About This Event</h2>
          <p className="event-detail-description">{event.description}</p>
        </div>

        <div className="event-detail-section">
          <h2 className="event-detail-section-title">Select Your Tickets</h2>
          <div className="ticket-selector">
            {event.ticketTypes.map(tier => {
              const available = tier.totalSeats - tier.bookedSeats;
              const soldOut = available === 0;
              const isSelected = selectedTier?.name === tier.name;

              return (
                <div 
                  key={tier.name}
                  onClick={() => !soldOut && setSelectedTier(tier)}
                  className={`ticket-tier ${soldOut ? 'ticket-tier-soldout' : ''} ${isSelected ? 'ticket-tier-selected' : ''}`}
                >
                  <div className="ticket-tier-header">
                    <div>
                      <div className="ticket-tier-name">{tier.name}</div>
                      <div className="ticket-tier-availability">
                        {soldOut ? (
                          <span className="ticket-tier-soldout-text">Sold Out</span>
                        ) : (
                          <span>{available} seats available</span>
                        )}
                      </div>
                    </div>
                    <div className="ticket-tier-price">₹{tier.price.toLocaleString()}</div>
                  </div>
                </div>
              );
            })}

            {selectedTier && (
              <div className="ticket-booking-panel">
                <div className="quantity-selector">
                  <label className="form-label">Number of Tickets (Max 5)</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={Math.min(5, selectedTier.totalSeats - selectedTier.bookedSeats)}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="quantity-input"
                  />
                </div>
                
                <div className="booking-footer">
                  <div>
                    <div className="text-muted" style={{ fontSize: 14 }}>Total Amount</div>
                    <div className="booking-total">₹{(selectedTier.price * quantity).toLocaleString()}</div>
                  </div>
                  <button 
                    onClick={handleBook}
                    disabled={loading}
                    className="book-button"
                  >
                    {loading ? 'Processing...' : 'Book Now'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}