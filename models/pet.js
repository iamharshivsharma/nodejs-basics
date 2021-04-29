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
  treatement: { type: String },
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
  let file;
  if (req?.file) {
    file = req.filename;
  } else {
    file = { filename: "" };
  }
  const { name, age, color, type, vaccine, treatement, food } = req.body;
  genetrateQrCode((cb) => {
    let pet = new Pet({
      name: name,
      age: age,
      color: color,
      type: type,
      vaccine: vaccine,
      treatement: treatement,
      food: food,
      image: file,
      userId: user.id,
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
  const { name } = req.body;

  let pet = {
    name: name,
  };
  if (req?.file) {
    pet.image = req.file.filename;
  }
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
  Recipe.findByIdAndRemove(req.params.petId)
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

function genetrateQrCode(callback) {
  let data = {
    name: "Employee Name",
    age: 27,
    department: "Police",
    id: "aisuoiqu3234738jdhf100223",
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
