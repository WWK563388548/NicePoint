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
router.post("/", function(req, res){
    // Get data from forms and add to restaurant array
    var restaurantName = req.body.restaurantName;
    var imageUrl = req.body.imageUrl;
    var desc = req.body.description;
    var newRestaurant = {restaurantName: restaurantName, restaurantImage: imageUrl, description: desc};
    // Create a new restaurant and save to DB
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log("Error: " + err);
        } else {
            // Redirect back to /restaurant page
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
router.get("/new", function(req, res){
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

module.exports = router;