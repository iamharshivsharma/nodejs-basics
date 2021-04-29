const express = require("express");
const router = express.Router();
const multer = require("multer");
const Pet = require("../models/pet");
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
  Pet.addData(req, res);
});
router.get("/get", (req, res) => {
  Pet.getAllData(req, res);
});
router.get("/get/:petId", upload.single("image"), (req, res) => {
  Pet.getSingleData(req, res);
});
router.put("/update/:petId", (req, res) => {
  Pet.updateData(req, res);
});
router.delete("/delete/:petId", (req, res) => {
  Pet.deleteData(req, res);
});
module.exports = router;
