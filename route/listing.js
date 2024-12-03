const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner,validatelisting } = require("../middleware.js");
const listingController= require("../controller/listing.js");
const multer=require("multer");
const storage=require("../cloudConfig.js");

const upload = multer(storage);

router.route("/")
.get( WrapAsync(listingController.index))
.post( isLoggedIn,upload.single('listing[image]'),validatelisting, WrapAsync(listingController.create))

//New Route
router.get("/new", isLoggedIn,WrapAsync(listingController.render));
//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,WrapAsync(listingController.edit));

router.route("/:id")
.get( WrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validatelisting, WrapAsync(listingController.update))
.delete(isLoggedIn,isOwner,WrapAsync(listingController.delete));

module.exports = router;