const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/protect');

const router = express.Router();


router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId, ticketType, quantity } = req.body;

    
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Event not found' });
    }

   
    const tier = event.ticketTypes.find((t) => t.name === ticketType);
    if (!tier) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Ticket type not found' });
    }

   
    const available = tier.totalSeats - tier.bookedSeats;
    if (available < quantity) {
      await session.abortTransaction();
      return res.status(400).json({ message: `Only ${available} seats left` });
    }

    
    await Event.updateOne(
      { _id: eventId, 'ticketTypes.name': ticketType },
      { $inc: { 'ticketTypes.$.bookedSeats': quantity } },
      { session }
    );

  
    const [booking] = await Booking.create(
      [
        {
          user: req.user._id,
          event: eventId,
          ticketType,
          quantity,
          totalAmount: tier.price * quantity,
        },
      ],
      { session }
    );

    const ticketDocs = [];
    for (let i = 0; i < quantity; i++) {
      const ticketCode = uuidv4();
      const qrCodeUrl = await QRCode.toDataURL(ticketCode); // base64 image
      ticketDocs.push({
        booking: booking._id,
        event: eventId,
        user: req.user._id,
        ticketCode,
        qrCodeUrl,
        ticketType,
      });
    }

    const createdTickets = await Ticket.insertMany(ticketDocs, { session });
    booking.tickets = createdTickets.map((t) => t._id);
    await booking.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      booking,
      tickets: createdTickets,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Booking failed', error: err.message });
  } finally {
    session.endSession();
  }
});


router.get('/mine', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date venue imageUrl')
      .populate('tickets')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;