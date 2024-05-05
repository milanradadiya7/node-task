const mongoose = require("mongoose");
// var mongoosePaginate = require('mongoose-paginate-v2');

var schema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    ProductDescription: {
        type: String,
        require: true
    },
    categories: {
        type: String,
        require: true
    },
    productPrice: {
        type: Number,
        require: true
    },
    productRating: {
        type: String,
        require: true
    },
    productSizeandColor: {
        type: String,
        require: true
    },
    productBrand: {
        type: String,
        require: true
    },
    productWarranty: {
        type: String,
        require: true
    },
    productReview: {
        type: String,
        require: true
    },
});
// schema.plugin(mongoosePaginate);
var ProductModel = mongoose.model('product', schema);


module.exports = ProductModel;