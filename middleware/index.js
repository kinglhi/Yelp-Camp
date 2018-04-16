var middlewareObj = {};
var Campground = require("../models/campground"),
    Comment = require("../models/comment");

// All middleware goes here
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

middlewareObj.checkAuthorizedCampgroundUser = function(req, res, next){
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
                // if campground not found
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
}

middlewareObj.checkAuthorizedComment = function(req, res, next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment) {
                req.flash("error", "You do not have permission to edit this comment.");
                res.redirect("back");
            } else {
                // does user own the campground?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;