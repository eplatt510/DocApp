var express = require("express");
var router = express.Router();
var Location = require("../models/location");
var middleware = require("../middleware");

//INDEX - show all locations
router.get("/locations", function(req, res){
   Location.find({}, function(err, allLocations){
        if(err){
            console.log(err);
    } else {
          res.render("locations/index", {locations: allLocations});
    }
    });
});

//CREATE LOCATION
router.post("/locations", middleware.isLoggedIn, function(req, res){
    // get data from form and add to location array
    var location = req.body.location;
    var quantity = req.body.quantity;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newLocation = {location: location, quantity: quantity, author: author};
    Location.create(newLocation, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/locations");
        }
    });
});

router.get("/locations/new", middleware.isLoggedIn, function(req, res){
   res.render("locations/new"); 
});

// SHOW LOCATION- shows more info about one location
router.get("/locations/:id", function(req, res){
    //find the location with provided ID
    Location.findById(req.params.id).populate("locations").exec(function(err, foundLocation){
        if(err){
            console.log(err);
        } else {
            console.log(foundLocation);
            res.render("locations/show", {location: foundLocation});
        }
    });
});

//EDIT CONTAINER ROUTE
router.get("/locations/:id/edit", middleware.isLoggedIn, function(req, res){
    Location.findById(req.params.id, function(err, foundLocation){
        if(err){
            req.flash("error", "Location not found");
        } else {
        res.render("locations/edit", {location: foundLocation});
        }
    });
});

//UPDATE CONTAINER ROUTE
router.put("/locations/:id", middleware.isLoggedIn, function(req, res){
    Location.findByIdAndUpdate(req.params.id, req.body.location, function(err, updatedLocation){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations");
        }
    });
});

//DESTROY CONTAINER ROUTE
router.delete("/locations/:id", middleware.isLoggedIn, function(req, res){
    Location.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations");
        }
    })
});


module.exports = router;
