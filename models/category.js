const mongoose = require("mongoose");
const User = require("./user");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const CategorySchema = mongoose.Schema({
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});
const Category = (module.exports = mongoose.model("Category", CategorySchema));

module.exports.getAllData = (req, res) => {
  let user = getUser(req);
  console.log(user._id, "user");

  Category.find()
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
  Catogory.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Category not found with this id",
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
  const { name } = req.body;

  let category = new Category({
    name: name,
    userId: user._id,
  });
  category
    .save()
    .then((resp) => {
      res.status(200).json({
        status: true,
        message: "Category added succcessfully",
        data: resp,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not saved" });
    });
};

module.exports.updateData = async (req, res) => {
  let category = req.body;

  //   if (req?.file) {
  //     category.image = req.file.filename;
  //   }
  console.log(req.body, "category info");
  Category.findByIdAndUpdate(req.params.id, category, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Category not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Category updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not updated" });
    });
};

module.exports.deleteData = async (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Category not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Category deleted successfully",
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
