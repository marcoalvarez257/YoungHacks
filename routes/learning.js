var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user"),
    middleware = require("../middleware"),
    mongoose   = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


// ===================
//   Learning Route
// ===================
// INDEX Learning Route
router.get("/home/my_learning/:userID", middleware.isLoggedIn ,function(req, res){
    User.findById(req.params.userID).populate("learning").exec(function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            res.render("./learning/index", {user: foundUser});
        }
    });
});

// UPDATE User Learning Route
router.put("/home/addLearning/:userID/:courseID", middleware.isLoggedIn ,function(req, res){
    User.findById(req.params.userID, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            foundUser.learning.push(req.params.courseID);
            foundUser.save();
            res.redirect("/home/courses/" + req.params.courseID);
        }
    }); 
}); 

// DESTROY User Learning Route
router.delete("/home/my_learning/:userID/:courseID", middleware.isLoggedIn ,function(req, res){
    User.findByIdAndUpdate(req.params.userID, 
        {"$pull" : {"learning" : mongoose.Types.ObjectId(req.params.courseID)}},
        function(err, updatedUser){
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/home/my_learning/" + req.params.userID);
            }
        });
});


module.exports = router;