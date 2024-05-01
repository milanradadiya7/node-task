const express = require('express');
const jwt = require("jsonwebtoken");

const { register, login, profile, profileUpdate, profileRemove, changePass, } = require("./views/apiController/authApiController/authApiController");
const { userList, userprofile, userRemove, userUpdate, } = require('./views/apiController/userApiController/userApiController');
const { sendOtp } = require('./views/apiController/otpApiController');

const route = express.Router();

function verify(req, res, next) {
    var token = req.headers.authorization;

    console.log(token, "token get.....");
    if (!token) {
        res.json({
            status: false,
            message: "provide token"
        });
    };

    try {
        req.payload = jwt.verify(token, 'key');
        next()
    } catch (error) {
        console.log(error, 'error in md');
        res.json({
            status: false,
            message: error
        });
    };
};

route.post("/api/register", register);
route.post("/api/login", login);
route.post("/api/profile-update", verify, profileUpdate);
route.get("/api/profile", verify, profile);
route.get("/api/logout", verify, profileRemove);
route.post("/api/change-password", verify, changePass);


route.get("/api/user-list", verify, userList);
route.get("/api/user/:userId", verify, userprofile);
route.put("/api/user-update/:userId", verify, userUpdate);
route.delete("/api/user-remove/:userId", verify, userRemove);

route.post("/api/sendOtp", verify, sendOtp);
// router.get('/api/verifyOTP', verifyOTP);




module.exports = {
    route
}