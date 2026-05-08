const express = require('express');
const Ticket = require('../models/Ticket');
const { protect, organizerOnly } = require('../middleware/protect');

const router = express.Router();


router.patch('/validate/:ticketCode', protect, organizerOnly, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketCode: req.params.ticketCode })
      .populate('event', 'title organizer')
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ valid: false, message: 'Ticket not found' });
    }

    
    if (ticket.event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ valid: false, message: 'Not your event' });
    }

    if (ticket.isUsed) {
      return res.status(400).json({
        valid: false,
        message: 'Already scanned',
        usedAt: ticket.usedAt,
      });
    }

    
    ticket.isUsed = true;
    ticket.usedAt = new Date();
    await ticket.save();

    res.json({
      valid: true,
      message: 'Entry granted',
      attendee: { name: ticket.user.name, email: ticket.user.email },
      event: ticket.event.title,
      ticketType: ticket.ticketType,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;