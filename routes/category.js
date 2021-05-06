const express = require("express");
const router = express.Router();
const multer = require("multer");
const Category = require("../models/category");
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
router.post("/add", (req, res) => {
  Category.addData(req, res);
});
router.get("/get", (req, res) => {
  Category.getAllData(req, res);
});
router.get("/get/:id", (req, res) => {
  Category.getSingleData(req, res);
});
router.put("/update/:id", (req, res) => {
  console.log(req.body, "update");
  Category.updateData(req, res);
});
router.delete("/delete/:id", (req, res) => {
  Category.deleteData(req, res);
});
module.exports = router;
