const mongoose = require("mongoose");
const User = require("./user");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const ProductSchema = mongoose.Schema({
  name: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  price: { type: String },
  description: { type: String },
  productType: { type: String },
  petType: { type: String },
  image: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});
const Product = (module.exports = mongoose.model("Product", ProductSchema));

module.exports.getAllData = (req, res) => {
  let user = getUser(req);
  console.log(user._id, "user");

  Product.find()
    .then((data) => {
      res.status(200).json({
        status: true,
        message: "All data fetch successfully",
        data: data,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ status: false, message: "Something went wrong", data: [] });
    });
};

module.exports.getSingleData = (req, res) => {
  Product.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Product not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Single data fetch successfully",
        data: data,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ status: false, message: "something went wrong", data: null });
    });
};
module.exports.addData = async (req, res) => {
  console.log(req.body);
  var user = getUser(req);
  console.log(user);
  console.log(req.file);
  var file = req.file;
  if (!file) {
    var file = { filename: "" };
  }
  const {
    name,
    price,
    description,
    categoryId,
    petType,
    productType,
  } = req.body;

  let product = new Product({
    name: name,
    price: price,
    description: description,
    categoryId: categoryId,
    petType: petType,
    productType: productType,
    image: file.filename,
    userId: user._id,
  });
  product
    .save()
    .then((resp) => {
      res.status(200).json({
        status: true,
        message: "Product added succcessfully",
        data: resp,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not saved" });
    });
};

module.exports.updateData = async (req, res) => {
  let product = req.body;

  if (req?.file) {
    product.image = req.file.filename;
  }
  console.log(req.body, "product info");
  Product.findByIdAndUpdate(req.params.id, product, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Product not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Product updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not updated" });
    });
};

module.exports.deleteData = async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Product not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Product deleted successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not deleted" });
    });
};

function getUser(req) {
  const token = req.headers["authorization"].split(" ")[1];
  return jwt.verify(token, config.secret);
}
