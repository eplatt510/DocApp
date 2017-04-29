var mongoose = require("mongoose");

//Customer schema setup
var customerSchema = new mongoose.Schema({
    companyName: String,
    contact: String,
    streetAddress: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    email: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    containers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Container"
        }
    ]
});

module.exports = mongoose.model("Customer", customerSchema);