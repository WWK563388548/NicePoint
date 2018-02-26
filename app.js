var express = require("express");
var catMe = require("cat-me");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/RedPoint");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// Create data
/*Restaurant.create(
    {
        restaurantName: "四川麻辣烫",
        restaurantImage: "https://tabelog.com/imgview/original?id=r1568448456758",
        description: "可以加的东西很多，还有很多国内的饮料，比如冰红茶，但是价格小贵，人均1500-2000円左右。"
    }, function(err, restaurant){
        if(err){
            console.log("Error: " + err);
        }else{
            console.log("New restaurant added!");
            console.log(restaurant);
        }
    });*/

// Create a landing page
app.get("/", function(req, res){
    res.render("landingPage");
});

// This is a INDEX route(RESTFUL route)
/**
 * url: /restaurants
 * verb: GET
 * function: Display a list of restaurant
 */
// Create a restaurant page
app.get("/restaurants", function(req, res){
    // Get all datas from DB
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log("Error: " + err);
        } else {
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
app.post("/restaurants", function(req, res){
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
app.get("/restaurants/new", function(req, res){
    res.render("new");
});

// This is a SHOW route(RESTFUL route)
/**
 * url: /restaurants/:id
 * verb: GET
 * function: Show information about a restaurant when click them in homepage
 */
app.get("/restaurants/:id", function(req, res){
    // find the restaurant with provided id
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log("Error: " + err);
        } else {
            res.render("showPage", {restaurant: foundRestaurant});
        }
    });
});

// Add Comment route
app.get("/restaurants/:id/comments/new", function(req, res){
    // find restaurant by id
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log("Error: " + err);
        } else {
            res.render("newComment", {restaurant: restaurant});
        }
    });
});

app.post("/restaurants/:id/comments", function(req, res){
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

app.listen("8888", function(){
    console.log("The NicePoint server has started!");
    console.log(catMe('nyan'));
});