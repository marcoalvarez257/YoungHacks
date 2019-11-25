var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    Contact         = require("../models/contact"),
    Newsletter      = require("../models/newsletter"),
    User            = require("../models/user"),
    middleware      = require("../middleware"),
    crypto          = require("crypto"),
    multer          = require("multer"),
    GridFsStorage   = require("multer-gridfs-storage"),
    Grid            = require("gridfs-stream"),
    path            = require("path");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var uri = "mongodb://localhost/young_hack";
var conn = mongoose.createConnection(uri);

//GFS Init
let gfs;
conn.once('open', function(){
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("Course");
});

var storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'Course'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  var upload = multer({ storage });

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
    successRedirect: "/home/courses",
    //successRedirect: "/instructor",
    failureRedirect: "/login"
}), function(req, res) {});

//Temporary Instructor login route
// router.post("/login", function(req, res){
//     res.redirect("/instructor");
// });

//SHOW register form
router.get("/register", function(req, res) {
    res.render("./users/new");
});

//CREATE new user and redirect to login page if successful
router.post("/register", function(req, res) {
    //get user details
    var newUser = new User({
        username: req.body.email,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
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

//Show Image Route
router.get("/displayImage/:filename", middleware.isLoggedIn, function(req, res){
    gfs.files.findOne({filename: req.params.filename}, function(err, file){
        //Check Files
        if(!file || file.length === 0)
        {
            return res.status(404).json({
                err: "No File Exists"
            });
        }

        if(file.contentType === "image/jpeg" || file.contentType === "image/png")
        {
            var readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else{
            res.status(404).json({
                err: "Not an image"
            });
        }
   });
});

module.exports = router;