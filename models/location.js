var mongoose = require("mongoose");

//Location schema setup
var locationSchema = new mongoose.Schema({
    location: String,
    quantity: String,
    quantityOpen: String,
    containers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Container"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Location", locationSchema);