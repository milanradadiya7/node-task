const jwt = require("jsonwebtoken");
const UserModel = require("../../models/userModel");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const fs = require('fs');

async function register(req, res) {
    var data = req.body;
    const schema = Joi.object({
        firstName: Joi.string().alphanum().min(3).max(30),
        lastName: Joi.string().alphanum().min(3).max(30),
        email: Joi.string().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        country: Joi.string().alphanum().min(3).max(30),
        state: Joi.string().alphanum().min(3).max(30),
        mobile: Joi.string().regex(/^[0-9]{10}$/)
    });

    const hashedPassword = await bcrypt.hash(data.password, 10);
    var valid = schema.validate(data);

    if (valid?.error) {
        console.log(valid.error.message);
        return res.json({
            message: valid.error.message,
            status: false
        });
    };

    var checkEmail = await UserModel.findOne({ email: data.email });
    if (checkEmail == null) {
        var userCreate = await UserModel.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            country: data.country,
            state: data.state,
            mobile: data.mobile,

        });
        console.log(userCreate, "usercreate.......");
        res.json({
            status: true,
            message: "Register Created",
            data: userCreate
        });
    } else {
        res.json({
            status: false,
            message: "Email is alredy register",
            data: userCreate
        });
    }
};


async function login(req, res) {

    const data = req.body;

    // Validate request data
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(data);
    if (error) {
        console.error("Validation error:", error.message);
        return res.json({
            message: error.message,
            status: false
        });
    }

    // Find user by email
    const loginUser = await UserModel.findOne({ email: data.email });
    if (!loginUser) {
        return res.json({
            status: false,
            message: "Login Failed: User not found",
            data: null
        });
    }

    // Generate JWT token
    const token = jwt.sign({
        _id: loginUser.id,
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        email: loginUser.email,
        country: loginUser.country,
        state: loginUser.state,
        mobile: loginUser.mobile,
    }, 'key');

    // Compare passwords
    const validPassword = await bcrypt.compare(data.password, loginUser.password);
    if (!validPassword) {
        return res.json({
            status: false,
            message: "Login Failed: Incorrect password",
        });
    }

    res.json({
        token: token,
        status: true,
        message: "Login Success",
        data: loginUser
    });

};

async function profile(req, res) {
    var profile = await UserModel.findOne({ _id: req.payload._id });
    delete profile.password
    console.log(profile, "profile admin get.................");

    res.json({
        status: true,
        message: "Profile",
        data: profile
    });
}

async function profileUpdate(req, res) {
    var data = req.body;
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

    if (req.files?.photo) {
        let uploadedFile = req.files.photo;
        {
            var photo = '/img/' + new Date().getTime() + "." + uploadedFile.mimetype.slice(6)

            // Use the mv() method to place the file somewhere on your server'
            uploadedFile.mv('./public' + photo, function (err) {
                if (err) return res.json({
                    message: err,
                    status: false
                });
                // File uploaded successfully
            });
            data.photo = photo
        }
        var findUser = await UserModel.findOne({ _id: req.payload._id });
        if (findUser.photo) {
            fs.unlink('./public' + findUser.photo, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('File deleted successfully');
            });
        }
    }

    var checkEmail = await UserModel.findOne({ email: data.email });
    if (checkEmail == null) {
        var profileUpdate = await UserModel.updateOne({ _id: req.payload._id }, data, { upsert: true });
        res.json({
            status: true,
            message: "Successfully Profile Updated",
        });
    } else {
        res.json({
            status: false,
            message: "Email is alredy Declare",
        });
    }

    // var profileUpdate = await UserModel.updateOne({ _id: req.payload._id }, data, { upsert: true });
    // console.log(profileUpdate, "profile update............................");
    // res.json({
    //     status: true,
    //     message: "Profile Updated"
    // });
};

async function profileRemove(req, res) {
    await UserModel.deleteOne({ _id: req.payload._id });
    res.json({
        status: true,
        message: "logout successfully",
    });
};

async function changePass(req, res) {
    const data = req.body;
    // Find the user by ID or any other identifier
    const user = await UserModel.findOne({ _id: req.payload._id });

    console.log(user, "user pass change.........", req.payload._id);
    if (!user) {
        return res.json({
            status: false,
            message: "User not found",
        });
    }

    // Compare old password provided by the user with the password stored in the database
    const validPassword = await bcrypt.compare(data.password, user.password);
    console.log(validPassword, "validate password ");
    if (!validPassword) {
        return res.json({
            status: false,
            message: "Incorrect old password",
        });
    }

    // Generate hash for the new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Update the password in the database
    await UserModel.updateOne({ _id: req.payload._id }, { password: hashedPassword });
    res.json({
        status: true,
        message: "Password changed successfully",
    });
};


module.exports = {
    register,
    login,
    profile,
    profileUpdate,
    profileRemove,
    changePass
}