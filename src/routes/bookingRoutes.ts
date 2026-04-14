import express from 'express';
import Booking from '../models/Booking.ts';
import Room from '../models/Room.ts';
import { sendBookingConfirmation } from '../lib/email';

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('roomId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    // Send confirmation email
    const room = await Room.findById(booking.roomId);
    if (room) {
      await sendBookingConfirmation(booking, room);
    }
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({ message: 'Error creating booking' });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking' });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting booking' });
  }
});

export default router;
