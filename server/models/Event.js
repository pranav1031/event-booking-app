const mongoose = require('mongoose');

const TicketTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
});

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    category: {
      type: String,
      enum: ['music', 'sports', 'tech', 'art', 'food', 'other'],
      default: 'other',
    },
    imageUrl: { type: String, default: '' },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketTypes: [TicketTypeSchema],
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);