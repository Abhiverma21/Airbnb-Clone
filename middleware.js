const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("./schema.js");


// Ensure a single, robust isLoggedIn middleware (previously defined twice)
module.exports.isLoggedIn = (req, res, next) => {
    // Log authentication and session info for debugging
    try {
        console.log(`[middleware.isLoggedIn] isAuthenticated=${req.isAuthenticated()}, sessionID=${req.sessionID}, originalUrl=${req.originalUrl}`);
    } catch (e) {
        console.warn('[middleware.isLoggedIn] could not read auth/session info', e);
    }

    if (!req.isAuthenticated || !req.isAuthenticated()) {
        // Save the URL user tried to access so we can redirect after login
        if (req && req.session) req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to your account");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
}


module.exports.isOwner= async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, error)

    } else {
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg2= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg2,400)
    }else{
        next();
    }
}
// ...existing code...




module.exports.isReviewOwner= async (req,res,next) =>{
    let {id} = req.params;
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}