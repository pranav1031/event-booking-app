const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketCode: { type: String, unique: true, required: true },
    qrCodeUrl: { type: String, required: true },
    ticketType: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);