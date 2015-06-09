var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require ("passport");
var passportLocal = require ("passport-local");

var routes = require('./routes/index');
var users = require('./routes/users');
var AlumnosController = require('./routes/alumnos.js').init();
var alumnos = new AlumnosController();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require ('ejs').renderFile);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(logger('dev'));
app.use(bodyParser.json());
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
        done(null,{id: username, name:username});
    } else{
        done(null,null);//second param is user object.
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);
app.use('/users', users);
app.use("/alumnos", alumnos.router);
passport.serializeUser(function(user,done){
    done(user.id);
});
passport.deserializeUser(function(id,done){
//query database or cacke here
    done({id: id, name:id});
});

app.get("/", function(req, res){
    res.render("inicio",{
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



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

app.set ("port", 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

