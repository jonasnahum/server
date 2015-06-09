var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require ("passport");
var passportLocal = require ("passport-local");

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ 
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done){
    //pretend this is using a real database.
    if(username === password){
        done(null, {id: username, name:username});
    } else{
        done(null, null);//second param is user object.
    }
}));


passport.serializeUser(function(user,done){
    done(null, user.id);
});
passport.deserializeUser(function(id,done){
//query database or cacke here
    done(null, {id: id, name:id});
})
app.get("/", function(req, res){
    res.render("index",{
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});
app.get("/login", function(req, res){
    res.render("login");
});
app.post("/login", passport.authenticate("local"), function(req, res){
    //it succeds it will stick a token for the user in session state in req.user
    res.redirect("/");
});

//las paginas de error estorbaban.

app.set ("port", 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
