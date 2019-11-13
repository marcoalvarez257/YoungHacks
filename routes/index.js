var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Contact = require("../models/contact"),
    Newsletter = require("../models/newsletter"),
    User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/about_us", function(req, res) {
    res.render("about");
});

router.get("/packages", function(req, res) {
    res.render("packages");
});

router.get("/gallery", function(req, res) {
    res.render("gallery");
});

router.get("/contact", function(req, res) {
    res.render("contact");
});

//CREATE new contact post and redirect to contact page
router.post("/contact", function(req, res) {
    //get data from contact 
    Contact.create(req.body.contact, function(err, newlyCreated) {
        if (err) {
            console.log(err);
            res.redirect("/contact");
        } else {
            res.redirect("/contact");
        }
    })
});

//CREATE new newsletter user and redirect to home page
router.post("/newsletter", function(req, res) {
    //get data from newsletter
    var email = req.body.newsletter;
    var newLetter = { email: email };
    Newsletter.create(newLetter, function(err, newlyCreated) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});


//=============
//  AUTH ROUTE
//=============
//SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});

//handle login route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), function(req, res) {});

//SHOW register form
router.get("/register", function(req, res) {
    res.render("register");
});

//CREATE new user and redirect to login page if successful
router.post("/register", function(req, res) {
    //get user details
    var newUser = new User({
        username: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DOB: req.body.date,
        streetAddress: req.body.address1 + ", " + req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.postal,
        country: req.body.country
    });
    User.register(newUser, req.body.password, function(err, newlyCreatedUser) {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }
        res.redirect("/login");
    });
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;