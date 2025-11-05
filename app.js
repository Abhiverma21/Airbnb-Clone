if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const listings = require("./route/listing.js");
const Review = require("./route/review.js");
const UserRouter = require("./route/user.js");
const User = require("./models/user.js");

const dbUrl = process.env.ATLAS_URL;

// ----- MIDDLEWARE -----
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ----- MONGODB CONNECTION -----
async function main() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
main();

// ----- SESSION STORE -----
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60 // 1 day
});

store.on("error", (err) => {
    console.error("MongoStore Error:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
};

app.use(session(sessionOptions));
app.use(flash());

// ----- PASSPORT CONFIG -----
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----- FLASH & CURRENT USER -----
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ----- ROUTES -----
app.use("/listings", listings);
app.use("/listings/:id/reviews", Review);
app.use("/", UserRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ----- 404 HANDLER -----
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

// ----- ERROR HANDLER -----
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    const showStack = process.env.NODE_ENV !== "production";
    console.error(err);
    res.status(statusCode).render("error.ejs", { message, error: showStack ? err : {} });
});

// ----- SERVER -----
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
