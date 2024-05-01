const mongoose = require("mongoose");

// const schema = mongoose.Schema;

const UserModel = mongoose.model('user', new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },

    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        require: true,
        default: "/avatar.png"
    }
}));
module.exports = UserModel;