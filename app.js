if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./route/listing.js");
const Review = require("./route/review.js");
const UserRouter = require("./route/user.js");
const favoriteRoutes = require("./route/favorite.js");
const apiBookings = require("./route/apiBookings.js");
const User = require("./models/user.js");
const session = require("express-session");
const Mongostore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const dbUrl = process.env.ATLAS_URL;

const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate);
main()
    .then(() => { console.log('Connected!') })
    .catch((err) => {
        console.log(err)
    });
async function main() {
    mongoose.connect(dbUrl);
}
//MongoStore
const store = Mongostore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60 // 1 day
});
store.on("error", (err) => {
    console.error("Error in MongoStore", err);
});
//sessions
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
};
// Home route

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listings);
// API routes (JSON)
app.use('/api', apiBookings);
app.get("/", (req, res) => {
    // Redirect locally to the listings route instead of the external live site
    res.redirect("/listings");
});
app.use("/listings/:id/reviews", Review);
app.use("/", UserRouter);
app.use("/", favoriteRoutes);
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"))
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something gone wrong" } = err;
    // Log full error server-side for debugging
    console.error(err);
    // In non-production show error details in the template (stack) for easier debugging
    const showStack = process.env.NODE_ENV !== "production";
    res.status(statusCode).render("error.ejs", { message, error: showStack ? err : {} });

});
