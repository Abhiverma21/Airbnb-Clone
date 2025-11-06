const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking');
const { isLoggedIn } = require('../middleware');

// Create a new booking (user must be logged in)
router.post('/bookings', isLoggedIn, bookingController.create);
// Delete a booking
router.delete('/bookings/:id', isLoggedIn, bookingController.delete);

module.exports = router;
