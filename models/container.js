var mongoose = require("mongoose");

//Container schema setup
var containerSchema = new mongoose.Schema({
    containerID: String,
    altID: String,
    location: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location"
        },
        username: String
    },
    companyName: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        },
        username: String
    },
    createDate: Date,
    lastAccessed: Date,
    destroyDate: Date,
    description: String,
    subContainer: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Container", containerSchema);