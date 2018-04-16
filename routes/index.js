var express = require("express"),
    User = require("../models/user"),
    passport = require("passport"),
    router = express.Router();
    
// ROOT route
router.get("/", function(req, res) {
   res.render("landingPage"); 
});

// AUTHENTICATION ROUTES
// Sign up route - GET
router.get("/register", function(req, res) {
   res.render("register"); 
});

// Sign up route - POST
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show login route - GET
router.get("/login", function(req, res) {
   res.render("login"); 
});

// Login route - POST
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "You are now logged out!")
   return res.redirect("/campgrounds");
});

// isLoggedIn authentication
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
