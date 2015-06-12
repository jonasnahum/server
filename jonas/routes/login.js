exports.init = function () {
    var express = require('express');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var expressSession = require('express-session');
    var passport = require ("passport");
    var passportLocal = require ("passport-local");
 
    
    var AlumnosController = function() {
        this.router = express.Router();
//        this.router.set('view engine', 'ejs');
        this.router.use(bodyParser.urlencoded({ extended: false }));
        this.router.use(cookieParser());
        this.router.use(expressSession({ 
            secret: process.env.SESSION_SECRET || "secret",
            resave: false,
            saveUninitialized: false
        }));
        this.router.use(passport.initialize());
        this.router.use(passport.session());
        
        passport.use(new passportLocal.Strategy(function(username, password, done){
            //pretend this is using a real database.
            if(username === password){
                done(null,{id: username, name:username});
            } else{
                done(null,null);//second param is user object.
            }
        }));
    
        passport.serializeUser(function(user,done){
            done(null,user.id);
        });
        passport.deserializeUser(function(id,done){
            //query database or cacke here
            done(null,{id: id, name:id});
        });
        this.register();
    };
    
    AlumnosController.prototype.register = function () {
        this.router.get("/", function(req, res){
            res.render("index",{
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        });
        this.router.get("/login", function(req, res){
            res.render("login");
        });
        this.router.post("/login", passport.authenticate("local"), function(req, res){
            //it succeds it will stick a token for the user in session state in req.user
            res.redirect("/menu");
        });
        this.router.get("/menu", function(req, res){
            res.render("menu");
        });
    };
    return AlumnosController;
};
 