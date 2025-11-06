const Listing = require("../models/listing.js");
const User = require("../models/user.js");


module.exports.index = (async (req, res) => {
    const allListings = await Listing.find({});
    let userFavorites = [];
    if (req.user) {
        const user = await User.findById(req.user._id);
        if (user && user.favorites) {
            userFavorites = user.favorites.map(f => f.toString());
        }
    }
    res.render("./listings/index.ejs", { allListings, userFavorites });

});
module.exports.render = (async (req, res) => {
    res.render("./listings/new.ejs");
});

module.exports.renderBookPage = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/book", { listing });
};



module.exports.create = async (req, res, next) => {
    try {
        // Debugging: log incoming file and body so we can see why uploads fail on Render
        console.log('[listing.create] req.file:', req.file);
        console.log('[listing.create] req.body.listing:', req.body && req.body.listing);

        if (!req.file) {
            req.flash("error", "Please upload an image");
            return res.redirect("/listings/new");
        }
        
        const listingData = req.body.listing;
        if (!listingData || !listingData.title || !listingData.description || !listingData.price || !listingData.location || !listingData.country) {
            req.flash("error", "Please fill all required fields");
            return res.redirect("/listings/new");
        }

        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing(listingData);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", "Error creating listing: " + err.message);
        res.redirect("/listings/new");
    }
};
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are requesting does not exist");
        res.redirect("/listings");
    }
    
    res.render("./listings/show.ejs", { listing });
};
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are requesting does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uploads","/uploads/w_250")
    res.render("./listings/edit.ejs", { listing,originalImageUrl });
};
module.exports.update=(async (req, res) => {

    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", " Listing Updated");

    res.redirect(`/listings/${id}`);
});
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted");
    res.redirect("/listings")
};