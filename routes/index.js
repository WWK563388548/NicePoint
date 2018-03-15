var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Restaurant = require("../models/restaurant");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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

// forgot password
router.get('/forgot', function(req, res) {
      res.render('forgot');
});
    
    router.post('/forgot', function(req, res, next) {
      async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
              req.flash('error', '该注册邮箱不存在');
              return res.redirect('/forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: 'NicePointInfo@gmail.com',
              pass: "wwk4652218"
            }
          });
          // NicePointOfficialInfo@gmail.com
          var mailOptions = {
            to: user.email,
            from: 'NicePointInfo@gmail.com',
            subject: 'NicePoint 密码重制',
            text: '您能收到这封邮件是因为您已经申请了密码重置功能。\n\n' +
              '请点击以下链接，或者在浏览器中复制粘贴该链接来完成接下来的步骤：\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              '如果此次密码重置不是由您本人申请，请无视此邮件，您的密码也将不会被改变。\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail sent');
            req.flash('success', '一封邮件已经被发往 ' + user.email + ' ，请查收。');
            done(err, 'done');
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
      });
    });
    
    // reset password by email
    router.get('/reset/:token', function(req, res) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token不可用或已经失效');
          return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
      });
    });
    
    router.post('/reset/:token', function(req, res) {
      async.waterfall([
        function(done) {
          User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              req.flash('error', 'Password reset token不可用或已经失效');
              return res.redirect('back');
            }
            if(req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
    
                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              })
            } else {
                req.flash("error", "密码不匹配");
                return res.redirect('back');
            }
          });
        },
        function(user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: 'NicePointInfo@gmail.com',
              pass: 'wwk4652218'
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'NicePointInfo@gmail.com',
            subject: '您的密码已经被修改',
            text: '您好,\n\n' +
              '您账户 ' + user.email + ' 的密码已经被修改。\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', '密码修改成功');
            done(err);
          });
        }
      ], function(err) {
        res.redirect('/campgrounds');
      });
    });

// User's profile
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "出错了!");
            res.redirect("/");
        }

        Restaurant.find().where('author.id').equals(foundUser._id).exec(function(err, restaurants){
            if(err){
                req.flash("error", "出错了!");
                res.redirect("/");
            }
            res.render("users/show", {user: foundUser, restaurants: restaurants});
        });
    });
});

module.exports = router;
