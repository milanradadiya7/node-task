const ProductModel = require("../models/productModel");



async function userProductCreate(req, res) {
    var data = req.body;
    await ProductModel.create({
        productName: data.productName,
        ProductDescription: data.ProductDescription,
        productPrice: data.productPrice,
        productBrand: data.productBrand,
        productWarranty: data.productWarranty,
        productReview: data.productReview,
    });
    res.json({
        status: true,
        message: "Product Created",
    });
};

async function productget(req, res) {
    var ProductGet = await ProductModel.find({});
    res.json({
        status: true,
        message: "Product get",
        data: ProductGet
    });
};

async function ProductUpdateGet(req, res) {
    var product = await ProductModel.findOne({ _id: req.params.userId });
    res.json({
        status: true,
        message: "Product Update get",
        data: product
    });
};

async function ProductUpdatePost(req, res) {
    var data = req.body;
    await ProductModel.updateOne({ _id: req.params.userId }, {
        productName: data.productName,
        ProductDescription: data.ProductDescription,
        productPrice: data.productPrice,
        productBrand: data.productBrand,
        productWarranty: data.productWarranty,
        productReview: data.productReview,
    });
    res.json({
        status: true,
        message: "Product Updated",
    });
};

async function productRemove(req, res) {
    await ProductModel.deleteOne({ _id: req.query.id });
    res.json({
        status: true,
        message: "Product remove",
    })
}

module.exports = {
    userProductCreate,
    productget,
    ProductUpdateGet,
    ProductUpdatePost,
    productRemove
}