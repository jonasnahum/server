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
        this.router.post('/crear', function(req, res, next) {
            
            req.accepts('application/json');
            
            var model = req.body;
                
            var endpoint = db.save(model);
            var promise = factory.getPromise(endpoint);
            
            promise.then(function(args) {
                var couchRes = args[0], body = args[1];
                res.status(couchRes.statusCode).json(body);
            });
            
            promise.fail(function(err, couchRes, body) {
                res.status(502).json({ 
                    error: "bad_gateway", 
                    reason: err.code,
                });
            });
        });
        
        /* GET obtiene un contribuyente por su id. */
        this.router.get('/ver/:id', function(req, res, next) {
            
            var endpoint = db.view(req.params.id);
            var promise = factory.getPromise(endpoint);
            
            promise.then(function(args) {
                var couchRes = args[0], body = args[1];
                res.status(couchRes.statusCode).json(body);
            });
            
            promise.fail(function(err, couchRes, body) {
                res.status(502).json({ error: "bad_gateway", reason: err.code });
            });
        });
        
        /* GET obtiene un contribuyente por su id. */
        this.router.get('/saludo', function(req, res, next) {
            res.send("hola jonas");
        });
     
    
        
        
    };
  
    return AlumnosController;
};
 