const Joi = require("joi");
const fs = require("fs");
const UserModel = require("../models/userModel");

async function userList(req, res) {
    var UserList = await UserModel.find({});
    console.log(UserList, "UserList.....");
    res.json({
        status: true,
        message: "User List Created",
        data: UserList
    });
};

async function userprofile(req, res) {
    var user = await UserModel.findOne({ _id: req.params.userId });
    console.log(user, "userprofileget..........");
    res.json({
        status: true,
        message: "Profile Find",
        data: user
    });
};

async function userUpdate(req, res) {
    var data = req.body;
    console.log(data);

    const schema = Joi.object({
        firstName: Joi.string().alphanum().min(3).max(30),
        lastName: Joi.string().alphanum().min(3).max(30),
        email: Joi.string().email(),
        country: Joi.string().alphanum().min(3).max(30),
        state: Joi.string().alphanum().min(3).max(30),
        mobile: Joi.string().regex(/^[0-9]{10}$/),
        image: Joi.allow(),
    });

    var valid = schema.validate(data);

    if (valid?.error) {
        console.log(valid.error.message);
        return res.json({
            message: valid.error.message,
            status: false
        });
    };

    await UserModel.updateOne({ _id: req.params.userId }, data, { upsert: true });
    res.json({
        status: true,
        message: "User Updated"
    });
};

async function userRemove(req, res) {

    if (req.params.userId == req.payload._id) {
        return res.json({
            status: false,
            message: "you can't delete your self.",
        });
    }

    var removeUser = await UserModel.deleteOne({
        _id: req.params.userId
    });
    console.log(req.query.id, "user remove id............");
    res.json({
        status: true,
        message: "User Removed",
    });
}

module.exports = {
    userList,
    userprofile,
    userUpdate,
    userRemove
}