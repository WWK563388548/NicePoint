var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Create a landing page
// root route
router.get("/", function(req, res){
    res.render("landingPage");
});

// Add auth route
// add register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'}); 
 });
 
// handle register logic
router.post("/register", function(req, res){
    var newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar 
        });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "欢迎来到NicePoint " + user.username);
            res.redirect("/restaurants");
        });
    });
});

// add login route
// Show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); 
 });
// handle login logic
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurants",
        failureRedirect: "/login"
    }), function(req, res){

});

// add logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "您已退出登陆");
    res.redirect("/restaurants");
});

module.exports = router;
