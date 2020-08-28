const 	express 	= require("express"),
		router		= express.Router(),
 		Hotel 		= require("../models/hotel"),
		Comment 	= require("../models/comment"),
		middleware 	= require("../middleware");

// Hotel Routes
router.get("/hotel", function(req,res){
	Hotel.find({}, function(err, hotel){
		if(err){
			console.log("error")
		} else{
			res.render("hotel/index", {hotel:hotel});
		}
	});
});

// New Hotel
router.post("/hotel", middleware.isLoggedIn, function(req,res){
	const 	name 	= req.body.name ,
	 		image 	= req.body.image,
		 	desc 	= req.body.description;
	const author	= {
		id: req.user._id,
		username: req.user.username
	}
	const newHotel = {name: name, image: image, description: desc, author:author};
	Hotel.create(newHotel, function(err, newlyCreated){
		if(err){
			console.log(err)
			console.log("error, photo can't be added")
		} else{
			res.redirect("/hotel")
		}
	});
});

// New Hotel Form
router.get("/hotel/new", middleware.isLoggedIn, function(req, res){
	res.render("hotel/new")
});

// Show Hotel
router.get("/hotel/:id", function(req, res){
	Hotel.findById(req.params.id).populate("comments").exec(function(err, foundHotel){
		if(err || !foundHotel){
			req.flash("error", "Hotel not found");
			res.redirect("back");
		} else {
			res.render("hotel/show", {hotel: foundHotel});
		}
	});
});

// Edit Hotel Route
router.get("/hotel/:id/edit", middleware.checkHotelOwnership, function(req, res){
	Hotel.findById(req.params.id, function(err, foundHotel){
		res.render("hotel/edit", {hotel:foundHotel});
	});
});
	
// Update Hotel Route
router.put("/hotel/:id", middleware.checkHotelOwnership, function(req, res){
	Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, updatedHotel){
		if (err){
			res.redirect("/hotel");
		} else {
			res.redirect("/hotel/" + req.params.id);
		}
	});
});

// Destroy Hotel Route
router.delete("/hotel/:id", middleware.checkHotelOwnership, function(req, res){
	Hotel.findByIdAndRemove(req.params.id, function(err){
	if(err){
		res.redirect("/hotel");
	} else{
		res.redirect("/hotel");
	}
	});
});



module.exports = router;