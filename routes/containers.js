var express = require("express");
var router = express.Router();
var Container = require("../models/container");
var middleware = require("../middleware");

//INDEX - show all customers
router.get("/containers", function(req, res){
   Container.find({}, function(err, allContainers){
        if(err){
            console.log(err);
    } else {
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
    var state = req.body.state;
    var zip = req.body.zip;
    var phone = req.body.phone;
    var email = req.body.email;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCustomer = {companyName: companyName, contact: contact, streetAddress: streetAddress, city: city, state: state, zip: zip, phone: phone, email: email, author: author, };
    Container.create(newCustomer, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/customers");
        }
    });
});

router.get("/customers/new", middleware.isLoggedIn, function(req, res){
   res.render("customers/new"); 
});

// SHOW CONTAINER- shows more info about one container
router.get("/customers/:id", function(req, res){
    //find the customer with provided ID
    Container.findById(req.params.id).populate("comments").exec(function(err, foundCustomer){
        if(err){
            console.log(err);
        } else {
            console.log(foundCustomer);
            res.render("customers/show", {customer: foundCustomer});
        }
    });
});

//EDIT CONTAINER ROUTE
router.get("/customers/:id/edit", middleware.isLoggedIn, function(req, res){
    Container.findById(req.params.id, function(err, foundCustomer){
        if(err){
            req.flash("error", "Customer not found");
        } else {
        res.render("customers/edit", {customer: foundCustomer});
        }
    });
});
//UPDATE CONTAINER ROUTE
router.put("/customers/:id", middleware.isLoggedIn, function(req, res){
    Container.findByIdAndUpdate(req.params.id, req.body.customer, function(err, updatedCustomer){
        if(err){
            res.redirect("/customers");
        } else {
            res.redirect("/customers/" + req.params.id);
        }
    });
});

//DESTROY CONTAINER ROUTE
router.delete("/customers/:id", middleware.isLoggedIn, function(req, res){
    Container.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/customers");
        } else {
            res.redirect("/customers");
        }
    })
});


module.exports = router;
