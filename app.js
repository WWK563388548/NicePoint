var express = require("express");
var catMe = require("cat-me");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/RedPoint");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA setup
var restaurantSchema = new mongoose.Schema({
    restaurantName: String,
    restaurantImage: String
});

// Compile schema to a model
var Restaurant = mongoose.model("Restaurant", restaurantSchema);

// Create data
/* Restaurant.create(
    {
        restaurantName: "四川麻辣烫",
        restaurantImage: "https://tabelog.com/imgview/original?id=r1568448456758"
    }, function(err, restaurant){
        if(err){
            console.log("Error: " + err);
        }else{
            console.log("New restaurant added!");
            console.log(restaurant);
        }
    }); */

// Create some fake data
var restaurantDatas = [
    {name: "海底捞", image: "https://uds.gnst.jp/rest/img/ba11tssh0000/s_0n5c.jpg?t=1500467047"},
    {name: "永祥生煎", image: "http://www.ei-show.com/img/ikebukuroimg003.jpg"},
    {name: "海底捞", image: "https://uds.gnst.jp/rest/img/ba11tssh0000/s_0n5c.jpg?t=1500467047"},
    {name: "永祥生煎", image: "http://www.ei-show.com/img/ikebukuroimg003.jpg"},
    {name: "海底捞", image: "https://uds.gnst.jp/rest/img/ba11tssh0000/s_0n5c.jpg?t=1500467047"},
    {name: "永祥生煎", image: "http://www.ei-show.com/img/ikebukuroimg003.jpg"}
];

// Create a landing page
app.get("/", function(req, res){
    res.render("landingPage");
});

// Create a restaurant page
app.get("/restaurants", function(req, res){
    // Get all datas from DB
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log("Error: " + err);
        } else {
            res.render("restaurants", {restaurantDatas: allRestaurants});
        }
    });
});

// Create a Post route
app.post("/restaurants", function(req, res){
    // Get data from forms and add to restaurant array
    var restaurantName = req.body.restaurantName;
    var imageUrl = req.body.imageUrl;
    var newRestaurant = {restaurantName: restaurantName, restaurantImage: imageUrl};
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

app.get("/restaurants/new", function(req, res){
    res.render("new");
});

app.get("*", function(req, res){
    res.send("404 ---- not found error");
});

app.listen("8888", function(){
    console.log("The NicePoint server has started!");
    console.log(catMe('nyan'));
});