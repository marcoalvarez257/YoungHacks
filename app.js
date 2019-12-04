//Requiring packages
var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    methodOverride  = require("method-override"),
    localStrategy   = require("passport-local"),
    bodyParser      = require("body-parser"),
    crypto          = require("crypto"),
    multer          = require("multer"),
    GridFsStorage   = require("multer-gridfs-storage"),
    Grid            = require("gridfs-stream"),
    path            = require("path");

//Model Require
var Newsletter      = require("./models/newsletter"),
    Contact         = require("./models/contact"),
    User            = require("./models/user"),
    Course          = require("./models/courses");

//Requiring routers
var indexRoutes     = require("./routes/index"),
    accountRoute    = require("./routes/account"),
    favouriteRoute  = require("./routes/favourite"),
    homeRoute       = require("./routes/home"),
    instructorRoute = require("./routes/instructor"),
    learningRoute   = require("./routes/learning"),
    profileRoute    = require("./routes/profile");

//Database Setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var uri = "mongodb://localhost/young_hack";
mongoose.connect(uri);


//PASSPORT Configuration
app.use(require("express-session")({
    secret: "Believe in youself",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Applcation Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Routers
app.use(indexRoutes);
app.use(accountRoute);
app.use(favouriteRoute);
app.use(homeRoute);
app.use(instructorRoute);
app.use(learningRoute);
app.use(profileRoute);


app.listen(process.env.PORT || 3000, process.env.IP, function(req, res) {
    console.log("YoungHacks server has started.");
});