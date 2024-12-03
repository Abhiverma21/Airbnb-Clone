const express=require("express");
const router= express.Router();
const User=require("../models/user");
const WrapAsync=require("../utils/wrapAsyc");
const passport = require("passport");
const  {saveRedirectUrl} = require("../middleware");
const userController = require("../controller/user.js");


router.get("/signUp", WrapAsync(userController.signUpForm));


router.post("/signUp", WrapAsync(userController.signUp));

//login

router.get("/login", WrapAsync(userController.loginForm));
//login
router.post("/login",saveRedirectUrl,
    passport.authenticate("local" , {failureRedirect:"/login",failureFlash:true}), WrapAsync(userController.login));

//logout

router.get("/logout",WrapAsync(userController.logout));


module.exports= router;