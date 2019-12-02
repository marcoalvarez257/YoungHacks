var express    = require("express");
    router     = express.Router(),
    User       = require("../models/user"),
    middleware = require("../middleware"),
    mongoose   = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


// ====================
//   Favourite Route
// ====================
// INDEX Favourite Route
router.get("/home/favourite/:userID", middleware.isLoggedIn ,function(req, res){
    User.findById(req.params.userID).populate("favourite").exec(function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            res.render("./favourite/index", {user: foundUser});
        }
    });
});

// UPDATE User Favourite Route
router.put("/home/addFavourite/:userID/:courseID", middleware.isLoggedIn ,function(req, res){
    User.findById(req.params.userID, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            foundUser.favourite.push(req.params.courseID);
            foundUser.save();
            res.redirect("/home/courses");
        }
    }); 
});

// DESTROY User Favourite Route
router.delete("/home/favourite/:userID/:courseID", middleware.isLoggedIn ,function(req, res){
    User.findByIdAndUpdate(req.params.userID,
        {"$pull" : {"favourite" : mongoose.Types.ObjectId(req.params.courseID)}},
        function(err, updatedUser){
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/home/favourite/" + req.params.userID);
            }
        });
});


module.exports = router;