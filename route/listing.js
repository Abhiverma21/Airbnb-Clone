const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

// pass an options object to multer and explicitly set storage for clarity
const upload = multer({ storage });

// =========================
// 📍 INDEX + CREATE
// =========================
router
  .route("/")
  .get(WrapAsync(listingController.index))
  .post(
    // small middleware to log auth/session state before handling file upload
    (req, res, next) => {
      try {
        console.log(`[route:/listings POST] isAuthenticated=${req.isAuthenticated ? req.isAuthenticated() : 'undef'}, sessionID=${req.sessionID}`);
      } catch (e) {
        console.warn('[route:/listings POST] error reading auth/session info', e);
      }
      next();
    },
    isLoggedIn,
    // multer should expect the same field name used in the form (<input name="image">)
    upload.single("image"),
    WrapAsync(listingController.create)
  );

// =========================
// 📍 NEW FORM
// =========================
router.get("/new", isLoggedIn, WrapAsync(listingController.render));

// =========================
// 📍 EDIT FORM
// =========================
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(listingController.edit));

// =========================
// 📍 SHOW / UPDATE / DELETE
// =========================
router
  .route("/:id")
  .get(WrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    // keep PUT consistent with POST: expect 'image'
    upload.single("image"),
    validatelisting,
    WrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, WrapAsync(listingController.delete));

// =========================
// 🆕 BOOKING PAGE ROUTE
// =========================
// When user clicks "Book Now" → open book.ejs page for that listing
router.get("/:id/book", isLoggedIn, WrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/book", { listing, id});
}));


// Booking confirmation page



module.exports = router;
