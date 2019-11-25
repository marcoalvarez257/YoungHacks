var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    middleware  = require("../middleware");

// ====================
//     Account Routes
// ====================
//EDIT Account Route
router.get("/home/account/:userID/edit", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.userID, function(err, foundUser){
        res.render("./account/edit", {foundUser: foundUser});
    });
});

//UPDATE Account Route
router.put("/home/account/:userID", middleware.isLoggedIn, function(req, res, next){
    User.changePassword(req.params.currPass, req.params.newPass, function(err){
        if(err)
        {
            return next(err);
        }
        else{
            res.redirect("/home/courses");
        }
    });
});

module.exports = router;