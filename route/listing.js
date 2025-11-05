const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const storage = require("../cloudConfig.js");

const upload = multer(storage);

// =========================
// 📍 INDEX + CREATE
// =========================
router
  .route("/")
  .get(WrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validatelisting,
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
    upload.single("listing[image]"),
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
