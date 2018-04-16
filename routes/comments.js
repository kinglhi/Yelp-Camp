var express = require("express"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"),
    router = express.Router({mergeParams: true});

// === COMMENTS ROUTE === //
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find comment by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err || !campground) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground}); 
        }
    });
});

router.get("/:comment_id/edit", middleware.checkAuthorizedComment, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err || !foundComment) {
        res.redirect("back");
    } else {
        res.render("../views/comments/editComment", {campground_id: req.params.id, comment: foundComment});
            }
    });
        
});

// Comment handling put request route
router.put("/:comment_id", middleware.checkAuthorizedComment, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedCampground) {
        if(err) {
            res.redirect("back");
        } 
            req.flash("success", "Comment edited and reposted.")
            res.redirect("/campgrounds/" + req.params.id);
    });
});


router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup comment using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err || !campground) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comments, function(err, comment) {
                if(err) {
                    req.flash("error", "Comment coul not be created.")
                    console.log(err);
                } else {
                    // add username & id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save that comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(function(err, saved) {
                        if(err) {
                            req.flash("error", "Comment could not be saved.")
                        }
                    req.flash("success", "Comment posted.");
                    res.redirect("/campgrounds/" + campground._id);
                    
                    });
                }
            })
            //connect new comment to campground
            //redirect to show page
        }
    });
   
});

// Comment destroy route
router.delete("/:comment_id", middleware.checkAuthorizedComment, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment) {
       if(err){}
       req.flash("success", "Comment deleted.");
       res.redirect("back");
   });
});

module.exports = router;