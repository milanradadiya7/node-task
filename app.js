const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { route } = require("./router");
const mongoose = require("mongoose");
var cors = require('cors');
const fileUpload = require("express-fileupload");

mongoose.connect("mongodb://localhost:27017/user", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(fileUpload());

app.set("view engine", "ejs");
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
};
app.use(cors());
//route
app.use("/", route);

app.listen(5656, () => {
    console.log("server is run");
});