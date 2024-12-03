const User = require("../models/user.js");

module.exports.signUpForm =  async(req,res)=>{
    res.render("user/SignUp.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
    const {username,email,password}=req.body;
    const newUser= new User({email,username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
};

module.exports.loginForm = async(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!! You are logged in !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/login");
    })
};
