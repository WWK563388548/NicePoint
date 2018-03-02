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

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;