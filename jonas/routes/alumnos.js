exports.init = function () {
    var jce = require("jimenez-couchdb-endpoints");    

    var express = require('express');
    var db = jce.database("nadiesabe");
    var factory = jce.promiseFactory(); 
    


    var AlumnosController = function() {
        this.router = express.Router();
        this.register();
    };
    
    AlumnosController.prototype.register = function () {
        this.router.get('/crear', function(req, res, next) {
               res.render('diagonalCrear');
        });
        this.router.post('/crear', function(req, res, next) {
            req.accepts('application/json');
            var endpoint = db.save(req.body);
            var promise = factory.getPromise(endpoint);
            
            promise.then(function(args) {
                var couchRes = args[0], body = args[1];
                res.locals.userName = req.body.userName;
                res.locals.apellido = req.body.apellido;
                res.locals.edad = req.body.edad;
                res.status(couchRes.statusCode).render('diagonalPost');
            });
            
            promise.fail(function(err, couchRes, body) {
                res.status(502).json({ 
                    error: "bad_gateway", 
                    reason: err.code,
                });
            });
        });
        this.router.get('/ver', function(req, res, next) {
               res.render('ver');
        });
        
        /* GET obtiene un contribuyente por su id. */
        this.router.post('/ver', function(req, res, next) {
            var endpoint = db.view(req.body.id);
            var promise = factory.getPromise(endpoint);
            
            promise.then(function(args) {
                var couchRes = args[0], body = args[1];
                var model = JSON.parse(body);
                res.locals.userName = model.userName;
                res.locals.apellido = model.apellido;
                res.locals.edad = model.edad;
                res.status(couchRes.statusCode).render("diagonalVer");
            });
            
            promise.fail(function(err, couchRes, body) {
                res.status(502).json({ error: "bad_gateway", reason: err.code });
            });
        });
        
        this.router.get('/actualizar', function(req, res, next) {
               res.render('actualizar');
        });
        
        /* PUT actualiza un alumno exitente. */
        this.router.post('/actualizar1', function(req, res, next) {
           // req.accepts('application/json');
            var model = 
                {
                    userName: req.body.userName,
                    apellido: req.body.apellido,
                    edad: req.body.edad
                }
         
            var endpoint = db.update(model, req.body.id, req.body.rev);
            var promise = factory.getPromise(endpoint);
            
            promise.then(function(args) {
                var couchRes = args[0], body = args[1];
                res.locals.id = body.id;
                res.locals.rev = body.rev;
                res.locals.userName = model.userName;
                res.locals.apellido = model.apellido;
                res.locals.edad = model.edad;
                res.status(couchRes.statusCode).render("diagonalPost");
            });
            
            promise.fail(function(err, couchRes, body) {
                res.status(502).json({ error: "bad_gateway", reason: err.code });
            });
            
        });
        this.router.get('/borrar', function(req, res, next) {
               res.render('borrar');
        });
        
        this.router.post('/borrar', function(req, res, next) {
            var endpoint = db.delete(req.body.id, req.body.rev);
            var promise = factory.getPromise(endpoint);
            
            promise.then(function(args) {
                var couchRes = args[0], body = args[1];
                var model = JSON.parse(body)
                res.locals.id = model.id;
                res.locals.rev = model.rev;
                res.status(couchRes.statusCode).render("diagonalDelete");
            });
            
            promise.fail(function(err, couchRes, body) {
                res.status(502).json({ error: "bad_gateway", reason: err.code });
            });
        });        
    };
    return AlumnosController;
};
 