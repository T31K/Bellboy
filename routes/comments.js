var express 	= require("express");
var router		= express.Router();
var Hotel	 	= require("../models/hotel");
var Comment 	= require("../models/comment");
var middleware 	= require("../middleware");


// Comments - New
router.get("/hotel/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Hotel.findById(req.params.id, function(err, hotel){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {hotel: hotel});

		}
	});
});

// Comments - Create
router.post("/hotel/:id/comments", middleware.isLoggedIn, function(req ,res){
	Hotel.findById(req.params.id, function(err, hotel){
		if(err){
			console.log(err);
			res.edirect("/hotel");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong. Please try again.");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					hotel.comments.push(comment);
					hotel.save();
					req.flash("success", "Comment added!");
					res.redirect("/hotel/" + hotel._id);
				}
			});
		}
	});
});

// Comments - Edit
router.get("/hotel/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Hotel.findById(req.params.id, function(err, foundHotel){
		if(err || !foundHotel){
			req.flash("error", "Cannot find hotel");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found");
				res.reditect("back");
			} else {
				res.render("comments/edit", {hotel_id:	req.params.id, comment:foundComment});
			}
		});
	});
});

// Comments - Update
router.put("/hotel/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/hotel/" + req.params.id);
		}
	});
});

// Comments - Delete
router.delete("/hotel/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
	if(err){
		res.redirect("back");
	} else{
		req.flash("success", "Comment removed!");
		res.redirect("back");
	}
	});
});



module.exports = router;