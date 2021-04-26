const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");

router.post("/add", (req, res) => {
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
