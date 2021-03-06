const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const multer = require("multer");
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
router.post("/add", upload.single("recipeImage"), (req, res) => {
  Recipe.addData(req, res);
});
router.get("/get", (req, res) => {
  Recipe.getAllData(req, res);
});
router.get("/get/:recipeId", (req, res) => {
  Recipe.getSingleData(req, res);
});
router.put("/update/:recipeId", (req, res) => {
  Recipe.updateData(req, res);
});
router.delete("/delete/:recipeId", (req, res) => {
  Recipe.deleteData(req, res);
});
module.exports = router;
