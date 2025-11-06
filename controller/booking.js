const Booking = require('../models/booking');
const Listing = require('../models/listing');

module.exports.create = async (req, res, next) => {
  try {
    const { listing, checkin, checkout, guests, paymentMethod, total, name, email, phone } = req.body;

    if (!listing || !checkin || !checkout) {
      return res.json({ success: false, error: 'Missing required fields' });
    }

    const foundListing = await Listing.findById(listing);
    if (!foundListing) {
      return res.json({ success: false, error: 'Listing not found' });
    }

    const booking = new Booking({
      listing,
      user: req.user._id,
      checkin: new Date(checkin),
      checkout: new Date(checkout),
      guests: Number(guests) || 1,
      paymentMethod: paymentMethod || 'Unknown',
      total: Number(total) || 0,
      contactName: name || '',
      contactEmail: email || '',
      contactPhone: phone || '',
      status: 'confirmed'
    });

    await booking.save();

    return res.json({ success: true, booking });
  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
};

// Delete a booking (only owner)
module.exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.json({ success: false, error: 'Booking not found' });
    // Ensure the current user owns the booking
    if (!req.user) {
      console.warn('Delete booking attempt without authenticated user');
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    if (!booking.user || booking.user.toString() !== req.user._id.toString()) {
      console.warn(`Unauthorized delete attempt by ${req.user._id} on booking ${id}`);
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await booking.deleteOne();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting booking:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
