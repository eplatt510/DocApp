var express = require("express");
var router = express.Router();
var Customer = require("../models/customer");
var middleware = require("../middleware");

//INDEX - show all customers
router.get("/customers", function(req, res){
    var time = new Date();
    console.log("=======================");
    console.log("Logged in at " + time.toLocaleString('en-US', { hour: 'numeric', minute:'numeric', hour12: true }));
    console.log(req.user);
    console.log("=======================");
    Customer.find({}, function(err, allCustomers){
        if(err){
            console.log(err);
    } else {
          res.render("customers/index", {customers: allCustomers});
    }
    });
});

//CREATE
router.post("/customers", middleware.isLoggedIn, function(req, res){
    // get data from form and add to customer array
    var companyName = req.body.companyName;
    var contact = req.body.contact;
    var streetAddress = req.body.streetAddress;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var phone = req.body.phone;
    var email = req.body.email;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCustomer = {companyName: companyName, contact: contact, streetAddress: streetAddress, city: city, state: state, zip: zip, phone: phone, email: email, author: author, };
    Customer.create(newCustomer, function(err, newlyCreated){
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

// SHOW - shows more info about one customer
router.get("/customers/:id", function(req, res){
    //find the customer with provided ID
    Customer.findById(req.params.id).populate("comments").exec(function(err, foundCustomer){
        if(err){
            console.log(err);
        } else {
            console.log(foundCustomer);
            res.render("customers/show", {customer: foundCustomer});
        }
    });
});

//EDIT CUSTOMER ROUTE
router.get("/customers/:id/edit", middleware.isLoggedIn, function(req, res){
    Customer.findById(req.params.id, function(err, foundCustomer){
        if(err){
            req.flash("error", "Customer not found");
        } else {
        res.render("customers/edit", {customer: foundCustomer});
        }
    });
});
//UPDATE CUSTOMER ROUTE
router.put("/customers/:id", middleware.isLoggedIn, function(req, res){
    Customer.findByIdAndUpdate(req.params.id, req.body.customer, function(err, updatedCustomer){
        if(err){
            res.redirect("/customers");
        } else {
            res.redirect("/customers/" + req.params.id);
        }
    });
});

//DESTROY CUSTOMER ROUTE
router.delete("/customers/:id", middleware.isLoggedIn, function(req, res){
    Customer.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/customers");
        } else {
            res.redirect("/customers");
        }
    })
});


module.exports = router;
