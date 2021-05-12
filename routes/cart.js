const express = require("express");
const router = express.Router();
const multer = require("multer");
const Cart = require("../models/cart");

router.post("/add", (req, res) => {
  Cart.addData(req, res);
});
router.get("/get", (req, res) => {
  Cart.getAllData(req, res);
});
// router.get("/get/:id", upload.single("image"), (req, res) => {
//   PetType.getSingleData(req, res);
// });
// router.put("/update/:id", upload.single("image"), (req, res) => {
//   console.log(req.body, "update");
//   PetType.updateData(req, res);
// });
router.delete("/delete/:id", (req, res) => {
  Cart.deleteData(req, res);
});
module.exports = router;
