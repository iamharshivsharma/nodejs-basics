const express = require("express");
const router = express.Router();
const multer = require("multer");
const PetType = require("../models/pet-type");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = new Date().toISOString().replace(/:/g, "_");
    cb(null, uniquePrefix + "-" + file.originalname.replace(/ /g, "_"));
  },
});

const upload = multer({ storage: storage });
router.post("/add", upload.single("image"), (req, res) => {
  PetType.addData(req, res);
});
router.get("/get", (req, res) => {
  PetType.getAllData(req, res);
});
router.get("/get/:id", upload.single("image"), (req, res) => {
  PetType.getSingleData(req, res);
});
router.put("/update/:id", upload.single("image"), (req, res) => {
  console.log(req.body, "update");
  PetType.updateData(req, res);
});
router.delete("/delete/:id", (req, res) => {
  PetType.deleteData(req, res);
});
module.exports = router;
