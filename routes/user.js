const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", (req, res) => {
  console.log(req.body);

  User.getUserByEmail(req.body.email, (err, user) => {
    console.log(user);
    if (user) {
      res.status(200).json({ status: false, message: "User already exists" });
      return;
    } else {
      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });
      newUser.save();
      res.status(200).json({ status: true, message: "Register Successfully" });
    }
  });
});

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    User.verifyPassword(password, user.password, (err, isVerified) => {
      if (err) throw err;

      if (isVerified) {
        res.json({
          success: true,

          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
          },
        });
      } else {
        return res.status(400).json({ success: false, msg: "Wrong password" });
      }
    });
  });
});
module.exports = router;
