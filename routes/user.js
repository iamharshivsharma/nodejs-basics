const express = require("express");
const router = express.Router();
const User = require("../models/user");
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

router.post("/register", upload.single("image"), (req, res) => {
  console.log(req.body, req.file);
  var file = req.file;
  if (!file) {
    var file = { filename: "" };
  }

  User.getUserByEmail(req.body.email, (err, user) => {
    console.log(user);
    if (user) {
      res.status(200).json({ status: false, message: "User already exists" });
      return;
    } else {
      let newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        email: req.body.email,
        password: req.body.password,
        image: file.filename,
      });
      try {
        newUser.save();
        res
          .status(200)
          .json({ status: true, message: "Register Successfully" });
      } catch (e) {
        res
          .status(500)
          .json({ status: false, message: "Something went wrong" });
      }
    }
  });
});

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    User.verifyPassword(password, user.password, (err, isVerified) => {
      if (err) throw err;

      if (isVerified) {
        res.json({
          success: true,
          data: user,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Wrong password" });
      }
    });
  });
});

router.get("/getUsers", (req, res) => {
  User.getAllUsers((cb) => {
    console.log(cb);
    if (cb) {
      res
        .status(200)
        .json({ status: true, message: "Users fetch successfully", data: cb });
    }
  });
});
router.post("/forgot-password", (req, res) => {
  console.log("working");
  const { email } = req.body;

  User.sendEmail(email, (err, resp) => {
    if (resp) {
      res.status(200).json({
        status: true,
        message: "Email sent to your email address",
      });
    } else {
      console.log(err);
      res.status(400).json({
        status: false,
        message: "Email not sent",
      });
    }
  });
});
router.post("/reset-password", (req, res) => {
  console.log("working", req.query.email, req.query.token);

  const email = req.query.email;
  const token = req.query.token;
  const password = req.body.password;
  User.getUserByEmail(email, (err, user) => {
    console.log(user);
    if (!user) {
      res.status(200).json({
        status: false,
        message: "Email doesn't exist in our database",
      });
      return;
    } else {
      User.resetPassword(user, token, password, (err, message) => {
        if (err) {
          res.status(400).json({ status: false, message: message });
        } else {
          res.status(200).json({ status: true, message: message });
        }
      });
    }
  });
});

router.post("/update-profile", upload.single("image"), (req, res, next) => {
  const email = req.body.email;
  console.log(req.body, req.file);
  var file = req.file;
  if (file) {
    req.body.image = req.file.filename;
  }
  let newValues = req.body;
  User.updateProfile(email, newValues, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    } else {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "Profile updated successfully." });
      }
    }
  });
});
module.exports = router;
