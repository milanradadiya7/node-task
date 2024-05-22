const ProductModel = require("../models/productModel");



async function userProductCreate(req, res) {
    var data = req.body;
    await ProductModel.create({
        productImage: data.productImage,
        productName: data.productName,
        ProductDescription: data.ProductDescription,
        productPrice: data.productPrice,
        productBrand: data.productBrand,
        productWarranty: data.productWarranty,
        productReview: data.productReview,
    });

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
        };
    };

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
        productImage: data.productImage,
        productName: data.productName,
        ProductDescription: data.ProductDescription,
        productPrice: data.productPrice,
        productBrand: data.productBrand,
        productWarranty: data.productWarranty,
        productReview: data.productReview,
    }, { upsert: true });

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
        };
    };

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

async function cartGet(req, res) {
    var cart = await ProductModel.findOne({ _id: req.params.userId });
    res.json({
        status: true,
        message: "cart get",
        data: cart
    });
};

module.exports = {
    userProductCreate,
    productget,
    ProductUpdateGet,
    ProductUpdatePost,
    productRemove,
    cartGet
}