const express=require("express");
const router= express.Router({mergeParams: true});
const WrapAsync= require("../utils/wrapAsyc.js");
const reviewController= require("../controller/review.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isLoggedIn, isOwner, isReviewOwner } = require("../middleware.js");

//Review Route
router.post("/",isLoggedIn,validateReview, WrapAsync(reviewController.createReview));
//Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewOwner,WrapAsync(reviewController.deleteReview));


module.exports= router;