var express = require("express");
var catMe = require("cat-me");
var app = express();

app.set("view engine", "ejs");

// Create a landing page
app.get("/", function(req, res){
    res.render("landingPage");
});

app.listen("8888", function(){
    console.log("The NicePoint server has started!");
    console.log(catMe('nyan'));
});