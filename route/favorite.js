const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');

// Toggle favorite status
router.post('/listings/:id/favorite', isLoggedIn, async (req, res) => {
    try {
        const listingId = req.params.id;
        const userId = req.user._id;
        
        const user = await User.findById(userId);
        const favoriteIndex = user.favorites.indexOf(listingId);
        
        if (favoriteIndex === -1) {
            // Add to favorites
            user.favorites.push(listingId);
        } else {
            // Remove from favorites
            user.favorites.splice(favoriteIndex, 1);
        }
        
        await user.save();
        res.json({ success: true, isFavorite: favoriteIndex === -1 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating favorites" });
    }
});

module.exports = router;