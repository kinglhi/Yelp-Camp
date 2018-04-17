var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    Campground = require("./models/campground"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Comment = require("./models/comment"),
    flash = require("connect-flash"),
    seedDB = require("./seeds");
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// mongoose.connect("mongodb://localhost/yelp_camp_v12_Deployed");
mongoose.connect("mongodb://kinglhi:!Chan!Liol007@ds247439.mlab.com:47439/yelpcamp");
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I am creator of my own reality",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Yelp Camp server has started!!");
});
