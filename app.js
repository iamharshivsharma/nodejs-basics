const express = require("express");
const config = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./routes/user");
const Recipes = require("./routes/recipe");

const app = express();
const path = require("path");
mongoose.connect(config.database);
mongoose.connection.on("connected", () => {
  console.log("Database is connected");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to database " + err);
});

const port = 8888;

app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("api is working good");
});
// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static("uploads"));
app.use("/users", User);
app.use("/recipe", Recipes);

app.listen(port, () => {
  console.log("server started on " + port);
});
