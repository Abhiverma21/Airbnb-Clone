const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

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
  const bookings = await Booking.find({ user: userId }).populate('listing').lean();
  res.render('user/profile.ejs', { user, listings, bookings });
  } catch (err) {
    next(err);
  }
};

// Update user profile (username, email)
module.exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { user } = req.body;
    if (!user) {
      req.flash('error', 'No data provided');
      return res.redirect('/profile');
    }

    const updateData = {};
    if (user.username) updateData.username = user.username.trim().toLowerCase();
    if (user.email) updateData.email = user.email.trim();

    // Basic validation
    if (!updateData.username || !updateData.email) {
      req.flash('error', 'Username and email are required');
      return res.redirect('/profile');
    }

    // Update and return
    await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile');
  } catch (err) {
    // Handle duplicate key error for unique fields
    if (err && err.code === 11000) {
      req.flash('error', 'Username or email already in use');
      return res.redirect('/profile');
    }
    next(err);
  }
};
