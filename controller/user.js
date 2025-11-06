const User = require("../models/user.js");
const Listing = require("../models/listing.js");

// ===================== SIGNUP FORM =====================
module.exports.signUpForm = async (req, res) => {
  res.render("user/SignUp.ejs");
};

// ===================== SIGNUP FUNCTION =====================
module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    // 🧹 Normalize username
    username = username.trim().toLowerCase();

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/signUp");
    }

    // 🧱 Create and register new user using passport-local-mongoose
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // 🚪 Automatically log in after signup
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to HotelVault!");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signUp");
  }
};

// ===================== LOGIN FORM =====================
module.exports.loginForm = async (req, res) => {
  res.render("user/login.ejs");
};

// ===================== LOGIN FUNCTION =====================
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to HotelVault!! You are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// ===================== LOGOUT FUNCTION =====================
module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/login");
  });
};

// ===================== PROFILE PAGE =====================
module.exports.profile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('favorites');
    const listings = await Listing.find({ owner: userId }).lean();
    res.render('user/profile.ejs', { user, listings });
  } catch (err) {
    next(err);
  }
};
