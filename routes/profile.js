var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    middleware  = require("../middleware");

// =====================
//   Profile Routes
// =====================
//EDIT Profile Route
router.get("/home/profile/:userID/edit", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.userID, function(err, foundUser){
        res.render("./users/edit", {foundUser : foundUser});
    }); 
});

//UPDATE Profile ROute
router.put("/home/profile/:userID", middleware.isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.params.userID, req.body.user, function(err, updatedUser){
        if(err)
        {
            console.log(err);
        }
        res.redirect("/home/courses");
    });
});

module.exports = router;