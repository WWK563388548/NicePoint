var express = require("express");
var router = express.Router({mergeParams:true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");

// Add Comment route
// add a middleware isLoggedIn()
router.get("/new",isLoggedIn, function(req, res){
    // find restaurant by id
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log("Error: " + err);
        } else {
            res.render("newComment", {restaurant: restaurant});
        }
    });
});

// create comment
router.post("/", function(req, res){
    // look up restaurant by id
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
            res.redirect("/restaurants");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to restaurant
                    restaurant.comments.push(comment);
                    restaurant.save();
                    // redirect show page
                    res.redirect("/restaurants/" + restaurant._id);
                }
            });
        }
    });
});

// add comment edit route
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("editComment", {restaurant_id: req.params.id, comment:foundComment});
        }
    });
});

// Update comment route
router.put("/:comment_id", function(req, res){
    // find and update the correct restaurant
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        // redirect the show page 
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});

// comment delete route
router.delete("/:comment_id", function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/restaurants/" + req.params.id);
       }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;