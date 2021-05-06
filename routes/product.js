const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product");
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
  Product.addData(req, res);
});
router.get("/get", (req, res) => {
  Product.getAllData(req, res);
});
router.get("/get/:id", upload.single("image"), (req, res) => {
  Product.getSingleData(req, res);
});
router.put("/update/:id", upload.single("image"), (req, res) => {
  console.log(req.body, "update");
  Product.updateData(req, res);
});
router.delete("/delete/:id", (req, res) => {
  Product.deleteData(req, res);
});
module.exports = router;
