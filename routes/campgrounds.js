var express = require("express"),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    router = express.Router();

//CAMPGROUNDS route - displays campgrounds list
router.get("/", function(req, res) {
    Campground.find({}, function(err, dbCampgrounds) {
        if(err || !dbCampgrounds) {
            console.log(err.message);
        } else {
            res.render("campgrounds/index", {campgrounds: dbCampgrounds});
        }
    })
});

// About YelpCamp page 
router.get("/about", function(req, res) {
   res.render("campgrounds/about"); 
});

//NEW route - shows form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE route - create new campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var price = req.body.price;
   var author = {
       id: req.user.id,
       username: req.user.username
   }
   var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    // create new campground & save  
   Campground.create(newCampground, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
           req.flash("sucess", "Campground created.");
           res.redirect("/campgrounds");
       }
   });
});

//SHOW route - show info about specific campground
router.get("/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground:foundCampground});
        }
    })
});

// Edit campground route
router.get("/:id/edit", middleware.checkAuthorizedCampgroundUser, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "Campground not found.")
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update campground route
router.put("/:id", middleware.checkAuthorizedCampgroundUser, function(req, res) {
    // find and update post
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated.")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete campground route
router.delete("/:id", middleware.checkAuthorizedCampgroundUser, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/campgrounds/" + req.params.id);
       } else {
           req.flash("success", "Campground deleted.");
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;
