var express 	= require("express");
var router		= express.Router();
var passport 	= require("passport");
var User		= require("../models/user");

// Root route
router.get("/", function(req,res){
	res.render("hotel/landing")
});


// Register Form
router.get("/register", function(req, res){
	res.render("register");
});

// Register Logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
      		return res.render("register", {"error": err.message});
    	}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome " + user.username);
			res.redirect("/hotel");
		});
	});
});

// Login Form
router.get("/login", function(req , res){
	res.render("login", {message: req.flash("error")});
});

// Login Logic
router.post("/login", passport.authenticate("local", 
	{
	successRedirect: "/hotel" ,
	failureRedirect: "/login"
	}), function(req, res){
});

// Log out Route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success","Logged out");
	res.redirect("/hotel");
});


module.exports = router;