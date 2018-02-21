var express = require("express");
var catMe = require("cat-me");
var bodyParser = require("body-parser");

var app = express();
// Create some fake data
var restaurantDatas = [
    {name: "小魏鸭脖", image: "https://tabelog.com/imgview/original?id=r9811028397831"},
    {name: "麻辣诱惑", image: "https://tabelog.com/imgview/original?id=r4034029493732"},
    {name: "海底捞", image: "https://uds.gnst.jp/rest/img/ba11tssh0000/s_0n5c.jpg?t=1500467047"},
    {name: "四川麻辣烫", image: "https://tabelog.com/imgview/original?id=r1568448456758"},
    {name: "永祥生煎", image: "http://www.ei-show.com/img/ikebukuroimg003.jpg"},
    {name: "小魏鸭脖", image: "https://tabelog.com/imgview/original?id=r9811028397831"},
    {name: "麻辣诱惑", image: "https://tabelog.com/imgview/original?id=r4034029493732"},
    {name: "海底捞", image: "https://uds.gnst.jp/rest/img/ba11tssh0000/s_0n5c.jpg?t=1500467047"},
    {name: "四川麻辣烫", image: "https://tabelog.com/imgview/original?id=r1568448456758"},
    {name: "永祥生煎", image: "http://www.ei-show.com/img/ikebukuroimg003.jpg"},
    {name: "小魏鸭脖", image: "https://tabelog.com/imgview/original?id=r9811028397831"},
    {name: "麻辣诱惑", image: "https://tabelog.com/imgview/original?id=r4034029493732"},
    {name: "海底捞", image: "https://uds.gnst.jp/rest/img/ba11tssh0000/s_0n5c.jpg?t=1500467047"},
    {name: "四川麻辣烫", image: "https://tabelog.com/imgview/original?id=r1568448456758"},
    {name: "永祥生煎", image: "http://www.ei-show.com/img/ikebukuroimg003.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Create a landing page
app.get("/", function(req, res){
    res.render("landingPage");
});

// Create a restaurant page
app.get("/restaurants", function(req, res){
    res.render("restaurants", {restaurantDatas: restaurantDatas});
});

// Create a Post route
app.post("/restaurants", function(req, res){
    // Get data from forms and add to restaurant array
    var restaurantName = req.body.restaurantName;
    var imageUrl = req.body.imageUrl;
    var newRestaurant = {name: restaurantName, image: imageUrl};
    restaurantDatas.push(newRestaurant);
    // Redirect back to /restaurant page
    res.redirect("/restaurants");
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