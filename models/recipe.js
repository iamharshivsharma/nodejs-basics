const mongoose = require("mongoose");
const User = require("./user");
const RecipeSchema = mongoose.Schema({
  name: { type: String },
  duration: { type: String },
  directions: { type: String },
  ingredients: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});
const Recipe = (module.exports = mongoose.model("Recipe", RecipeSchema));

module.exports.getAllData = (req, res) => {
  Recipe.find()
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
  Recipe.findById(req.params.recipeId)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Recipe not found with this id",
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
  const { name, duration, directions, ingredients, email } = req.body;
  let user = await User.findOne({ email: email });
  let recipe = new Recipe({
    name: name,
    duration: duration,
    directions: directions,
    ingredients: ingredients,
    userId: user.id,
  });
  recipe
    .save()
    .then((resp) => {
      res.status(200).json({
        status: true,
        message: "Recipe added succcessfully",
        data: resp,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not saved" });
    });
};

module.exports.updateData = async (req, res) => {
  const { name, duration, directions, ingredients } = req.body;
  let recipe = {
    name: name,
    duration: duration,
    directions: directions,
    ingredients: ingredients,
  };
  Recipe.findByIdAndUpdate(req.params.recipeId, recipe, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Recipe not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Recipe updated successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not updated" });
    });
};

module.exports.deleteData = async (req, res) => {
  Recipe.findByIdAndRemove(req.params.recipeId)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          status: false,
          message: "Recipe not found with this id",
          data: data,
        });

        return;
      }
      res.status(200).json({
        status: true,
        message: "Recipe deleted successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Not deleted" });
    });
};
