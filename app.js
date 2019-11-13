//Requiring packages
var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    localStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    Newsletter = require("./models/newsletter"),
    Contact = require("./models/contact"),
    User = require("./models/user");

//Requiring routers
var indexRoutes = require("./routes/index");

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

//Routers
app.use(indexRoutes);


// ========================
//  Main Application Route
// ========================
app.get("/home", function(req, res) {
    res.send("Welcome to home page!");
});


app.listen(process.env.PORT || 3000, process.env.IP, function(req, res) {
    console.log("Young Hacks server has started.");
});