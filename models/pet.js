const mongoose = require("mongoose");
const User = require("./user");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const PetSchema = mongoose.Schema({
  name: { type: String },
  age: { type: String },
  color: { type: String },
  type: { type: String },
  vaccine: { type: String },
  treatment: { type: String },
  food: { type: String },

  image: { type: String },
  qrCode: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});
const Pet = (module.exports = mongoose.model("Pet", PetSchema));

module.exports.getAllData = (req, res) => {
  Pet.find()
    .then((data) => {
      res.status(200).json({
        status: true,
        message: "all data fetch successfully",
        data: data,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ status: false, message: "something went wrong", data: [] });
    });
};

module.exports.getSingleData = (req, res) => {
  Pet.findById(req.params.petId)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Pet not found with this id",
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
  const { name, age, color, type, vaccine, treatment, food } = req.body;
  genetrateQrCode(req.body, (cb) => {
    let pet = new Pet({
      name: name,
      age: age,
      color: color,
      type: type,
      vaccine: vaccine,
      treatment: treatment,
      food: food,
      image: file.filename,
      userId: user._id,
      qrCode: cb,
    });
    pet
      .save()
      .then((resp) => {
        res.status(200).json({
          status: true,
          message: "Pet added succcessfully",
          data: resp,
        });
      })
      .catch((err) => {
        res.status(500).json({ status: false, message: "Not saved" });
      });
  });
};

module.exports.updateData = async (req, res) => {
  let pet = req.body;

  if (req?.file) {
    pet.image = req.file.filename;
  }
  console.log(pet, req.body, "pet info");
  Pet.findByIdAndUpdate(req.params.petId, pet, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "pet not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Pet updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not updated" });
    });
};

module.exports.deleteData = async (req, res) => {
  Pet.findByIdAndRemove(req.params.petId)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Pet not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Pet deleted successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not deleted" });
    });
};

function genetrateQrCode(json, callback) {
  let data = {
    name: json.name,
    age: json.age,
    type: json.type,
  };
  let stringdata = JSON.stringify(data);
  // Print the QR code to terminal
  // QRCode.toString(stringdata, { type: "terminal" }, function (err, QRcode) {
  //   if (err) return console.log("error occurred");

  //   // Printing the generated code
  //   console.log(QRcode);
  // });

  QRCode.toDataURL(stringdata, function (err, url) {
    if (err) return console.log("error occured");
    console.log(url);
    callback(url);
  });
}
function getUser(req) {
  const token = req.headers["authorization"].split(" ")[1];
  return jwt.verify(token, config.secret);
}
