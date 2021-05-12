const express = require("express");
const config = require("./config/database");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./routes/user");
const Recipes = require("./routes/recipe");
const Pet = require("./routes/pet");
const PetType = require("./routes/pet-type");
const Product = require("./routes/product");
const Category = require("./routes/category");
const Cart = require("./routes/Cart");

const app = express();
const path = require("path");
mongoose.connect(config.database);
mongoose.connection.on("connected", () => {
  console.log("Database is connected");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to database " + err);
});

const port = 3000;

app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("api is working good");
});
// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
app.use("/uploads", express.static("uploads"));
app.use("/users", User);
passport.authenticate("jwt", { session: false });
app.use("/recipe", Recipes);
app.use("/pet", passport.authenticate("jwt", { session: false }), Pet);
app.use("/pet-type", PetType);

app.use("/product", passport.authenticate("jwt", { session: false }), Product);
app.use("/cart", passport.authenticate("jwt", { session: false }), Cart);

app.use(
  "/category",
  passport.authenticate("jwt", { session: false }),
  Category
);

app.listen(port, () => {
  console.log("server started on " + port);
});
