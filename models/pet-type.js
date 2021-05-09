const mongoose = require("mongoose");
const User = require("./user");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const PetTypeSchema = mongoose.Schema({
  name: { type: String },
  status: { type: String },
});
const PetType = (module.exports = mongoose.model("PetType", PetTypeSchema));

module.exports.getAllData = (req, res) => {
  //   let user = getUser(req);
  //   console.log(user._id, "user");

  PetType.find()
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
  petType
    .findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "pet type not found with this id",
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
  //   var user = getUser(req);
  //   console.log(user);
  const { name, status } = req.body;

  let petType = new PetType({
    name: name,
    status: status,
  });
  petType
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
  let pet = req.body;

  //   if (req?.file) {
  //     category.image = req.file.filename;
  //   }
  console.log(req.body, "Pet type info");
  PetType.findByIdAndUpdate(req.params.id, pet, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Pet type not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Pet type updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not updated" });
    });
};

module.exports.deleteData = async (req, res) => {
  PetType.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Pet type not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "pet type deleted successfully",
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
