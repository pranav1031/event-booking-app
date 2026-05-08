import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => setEvent(data));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    
    try {
      await api.post('/bookings', {
        eventId: id,
        ticketType: selectedTier.name,
        quantity
      });
      alert('Booking successful! Check your bookings page.');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!event) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>{event.title}</h1>
      <p style={{ color: '#666' }}>
        {new Date(event.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <p style={{ color: '#666' }}>📍 {event.venue.name}, {event.venue.address}</p>
      
      <div style={{ margin: '2rem 0' }}>
        <h3>About</h3>
        <p>{event.description}</p>
      </div>

      <div>
        <h3>Select Tickets</h3>
        {event.ticketTypes.map(tier => {
          const available = tier.totalSeats - tier.bookedSeats;
          const soldOut = available === 0;

          return (
            <div 
              key={tier.name}
              onClick={() => !soldOut && setSelectedTier(tier)}
              style={{
                border: selectedTier?.name === tier.name ? '2px solid #4f46e5' : '1px solid #ddd',
                borderRadius: 8,
                padding: '1rem',
                marginBottom: '0.5rem',
                cursor: soldOut ? 'not-allowed' : 'pointer',
                opacity: soldOut ? 0.5 : 1,
                background: selectedTier?.name === tier.name ? '#f5f3ff' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{tier.name}</strong>
                  <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                    {soldOut ? 'Sold out' : `${available} seats left`}
                  </p>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700 }}>₹{tier.price}</span>
              </div>
            </div>
          );
        })}

        {selectedTier && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: 8 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
            <input 
              type="number" 
              min={1} 
              max={10}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ padding: '0.5rem', width: 100, marginBottom: '1rem' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                Total: ₹{selectedTier.price * quantity}
              </span>
              <button 
                onClick={handleBook}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 16
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}