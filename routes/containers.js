var express = require("express");
var router = express.Router();
var Container = require("../models/container");
var Location = require("../models/location");
var middleware = require("../middleware");
var mongoose = require("mongoose");


//INDEX - show all containers
router.get("/containers", function(req, res){
   Container.find({}, function(err, allContainers){
        if(err){
            console.log(err);
    } else  {
                res.render("containers/index", {containers: allContainers});
            }
    });
});

//CREATE CONTAINER
router.post("/containers", middleware.isLoggedIn, function(req, res){
    // get data from form and add to container array
    var containerID = req.body.containerID;
    var altID = req.body.altID;
    var location = req.body.location;
    var customer = req.body.customer;
    var createDate = req.body.createDate;
    var lastAccessed = req.body.lastAccessed;
    var destroyDate = req.body.destroyDate;
    var description = req.body.description;
    var subContainer = req.body.subContainer;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    location = mongoose.mongo.ObjectId(location);
    
    var newContainer = {containerID: containerID, altID: altID, location: location, customer: customer, destroyDate: destroyDate, description: description, subContainer: subContainer, author: author};
    Container.create(newContainer, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            Location.findById(location, function(err, foundLocation){
                if(err){
                    console.log(err);
                } else {
                    foundLocation.containers.push(newlyCreated._id);
                    foundLocation.save();
                    // console.log(newlyCreated._id);
                    console.log(foundLocation.containers);
                }
            });
            
            res.redirect("/containers");
        }
    });
});

// SHOW NEW CONTAINER FORM
router.get("/containers/new", middleware.isLoggedIn, function(req, res){
    Location.find({}, function(err, allLocations){
        if(err){
            console.log(err);
        } else  {
            res.render("containers/new", {locations: allLocations}); 
        }
    });
});

// SHOW CONTAINER- shows more info about one container
router.get("/containers/:id", function(req, res){
    //find the container with provided ID
    Container.findById(req.params.id).populate("containers").exec(function(err, foundContainer){
        if(err){
            console.log(err);
        } else {
           Location.findById(foundContainer.location).select("location quantity").exec(function(err, foundLocation){
               if(err){
                   console.log(err);
               } else {
                   res.render("containers/show", {container: foundContainer, location: foundLocation});
               }
           });
        }
    });
});

//EDIT CONTAINER ROUTE
router.get("/containers/:id/edit", middleware.isLoggedIn, function(req, res){
    Container.findById(req.params.id, function(err, foundContainer){
        if(err){
            req.flash("error", "Container not found");
        } else {
        res.render("containers/edit", {container: foundContainer});
        }
    });
});
//UPDATE CONTAINER ROUTE
router.put("/containers/:id", middleware.isLoggedIn, function(req, res){
    Container.findByIdAndUpdate(req.params.id, req.body.container, function(err, updatedContainer){
        if(err){
            res.redirect("/containers");
        } else {
            res.redirect("/containers/" + req.params.id);
        }
    });
});

//DESTROY CONTAINER ROUTE
router.delete("/containers/:id", middleware.isLoggedIn, function(req, res){
    Container.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/containers");
        } else {
            res.redirect("/containers");
        }
    })
});

function toObjectId(ids) {

    if (ids.constructor === Array) {
        return ids.map(mongoose.Types.ObjectId);
    }

    return mongoose.Types.ObjectId(ids);
}


module.exports = router;
