var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");

// This is a INDEX route(RESTFUL route)
/**
 * url: /restaurants
 * verb: GET
 * function: Display a list of restaurant
 */
// Create a restaurant page
router.get("/", function(req, res){
    // Get all datas from DB
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log("Error: " + err);
        } else {
            // console.log(req.user);
            res.render("index", {restaurantDatas: allRestaurants});
        }
    });
});

// This is a CREATE route(RESTFUL route)
/**
 * url: /restaurants
 * verb: POST
 * function: Add new restaurant to DB
 */
// Create a Post route
router.post("/", isLoggedIn, function(req, res){
    // Get data from forms and add to restaurant array
    var restaurantName = req.body.restaurantName;
    var imageUrl = req.body.imageUrl;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    };
    var newRestaurant = {restaurantName: restaurantName, restaurantImage: imageUrl, description: desc, author:author};
    // Create a new restaurant and save to DB
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log("Error: " + err);
        } else {
            // Redirect back to /restaurant page
            // console.log(newlyCreated);
            res.redirect("/restaurants");
        }
    }); 
});

// This is a NEW route(RESTFUL route)
/**
 * url: /restaurants/new
 * verb: GET
 * function: Show form to create new restaurant
 */
router.get("/new", isLoggedIn, function(req, res){
    res.render("new");
});

// This is a SHOW route(RESTFUL route)
/**
 * url: /restaurants/:id
 * verb: GET
 * function: Show information about a restaurant when click them in homepage
 */
router.get("/:id", function(req, res){
    // find the restaurant with provided id
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log("Error: " + err);
        } else {
            res.render("showPage", {restaurant: foundRestaurant});
        }
    });
});

// Edit restaurant route
router.get("/:id/edit", checkShowPageOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("edit", {restaurant: foundRestaurant});     
    });  
});

// Update restaurant route
router.put("/:id", checkShowPageOwnership, function(req, res){
    // find and update the correct restaurant
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updateRestaurant){
        // redirect the show page 
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});

// Destory restaurant route
router.delete("/:id", checkShowPageOwnership, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        // redirect the show page 
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
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

// middleware
function checkShowPageOwnership(req, res, next){
    if(req.isAuthenticated()){
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
            if(err){
                res.redirect("back");
            } else {
                // Does users own the show page
                // "foundRestaurant.author.id" is a mongoose object
                // "req.user._id" is a string
                if(foundRestaurant.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;