// Packages
var express 			= require("express"),
	app 				= express(),
 	bodyParser 			= require("body-parser"),
	Hotel	 			= require("./models/hotel"),
	mongoose			= require('mongoose'),
	seedDB				= require("./seeds"),
	flash				= require("connect-flash"),
	Comment 			= require("./models/comment"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	methodOverride		= require("method-override"),
	User				= require("./models/user");


// Routes
var	commentRoutes		= require("./routes/comments"),
	hotelRoutes			= require("./routes/hotel"),
	indexRoutes			= require("./routes/index");
	
console.log(process.env.DATABASEURL);
// MongoDB Config
mongoose.connect(process.env.DATABASEURL,{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Package Configs
app.use(bodyParser.urlencoded({extended: true}));					// BodyParser
app.set("view engine","ejs");										// EJS
app.use(express.static(__dirname + "/public")); 					// CSS
app.use(methodOverride("_method"));									// Method Override
app.use(flash());													// Connect-flash
app.use("/public", express.static('public')); 						// Fav Icon

// Seed Data seedDB();

// PassportJS Config
app.use(require("express-session")({
	secret: "cowy",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes 
app.use(indexRoutes);
app.use(hotelRoutes);
app.use(commentRoutes);

// Server
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server started!")
});
