var express     = require("express"),
    router      = express.Router(),
    Course      = require("../models/courses"),
    middleware  = require("../middleware");

// ========================
//  Main Application Route
// ========================
// Landing Page Route
router.get("/home/courses", middleware.isLoggedIn, function(req, res) {
    Course.find({}, function(err, foundCourses){
        res.render("./courses/index", {courses : foundCourses});
    });
});

// SHOW Course Rote
router.get("/home/courses/:id", middleware.isLoggedIn, function(req, res) {
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
        }
        else{
            res.render("./courses/show", {course: course});
        }
    });
});

// SHOW Video Route
router.get("/home/courses/:id/playVideo", function(req, res){
    res.render("./courses/video");
});

module.exports = router;