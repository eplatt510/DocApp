var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");
 
//Schema models   
var Customer        = require("./models/customer"),
    User            = require("./models/user"),
    Container       = require("./models/container");

//Routes
var indexRoutes         = require("./routes/index"),
    customerRoutes    = require("./routes/customers");

app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Bohannon is a big whiney baby!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

console.log("DatabaseURL: " + process.env.DOCSTOREDBURL);
   
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use(customerRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started...");
});