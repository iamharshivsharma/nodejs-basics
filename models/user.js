const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
const config = require("../config/credential");
const bcrypt = require("bcryptjs");

sgMail.setApiKey(config.sendGridApiKey);
const msg = {
  to: "", // Change to your recipient
  from: "harshivindiit@yopmail.com", // Change to your verified sender
  subject: "Reset Password",
  text: "Please use below link to reset the password",
  html:
    `<h2>Please click on the below link to reset the password</h2>` +
    "<a href='localhost:8888/users/reset-password?email={email}&token={token}'>Click here </a>",
};
const UserSchema = mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  contact: { type: String },
  fiscalNumber: { type: String, required: true },
  gender: { type: String },
  nationality: { type: String },
  address: { type: String },
  city: { type: String },
  zipCode: { type: String },
  country: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  language: { type: Object },
  token: { type: String },
  tokenExpiration: { type: Date },
});

const User = (module.exports = mongoose.model("User", UserSchema));
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};
module.exports.registerUser = (req, res) => {
  console.log(res);
};
module.exports.getUserByEmail = async (email, cb) => {
  User.findOne({ email: email }, cb);
};
module.exports.getAllUsers = (cb) => {
  User.find().then((data) => {
    cb(data);
  });
};
module.exports.verifyPassword = (givenPassword, hash, callback) => {
  bcrypt.compare(givenPassword, hash, (err, isMatch) => {
    console.log(givenPassword, hash);
    console.log(isMatch, "ismatch");
    if (err) throw err;
    callback(null, isMatch);
  });
  // if (old_password == givenPassword) {
  //   callback(null, true);
  // } else {
  //   callback(null, false);
  // }
};
module.exports.sendEmail = async (email, cb) => {
  let user = await User.findOne({ email: email });
  if (user) {
    msg.to = user.email;

    user.token = new Date().getTime();
    user.tokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save().then((res) => {
      console.log(res);
    });

    console.log(user, "after change");
    console.log(msg);
    msg.html.replace("{email}", user.email);
    msg.html.replace("{token}", user.token);
    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        cb(null, true);
        console.log(response[0].headers);
      })
      .catch((error) => {
        console.error(error);
        cb(error, false);
      });
  } else {
    cb(null, false);
  }
};

module.exports.resetPassword = (user, token, password, cb) => {
  console.log(user.token, token);
  User.findOne(
    { token: token, tokenExpiration: { $gt: Date.now() } },
    (err, user) => {
      if (!user) {
        cb(true, "Reset token is invalid or has expired");
        return;
      } else {
        user.password = password;
        user.token = undefined;
        user.tokenExpiration = undefined;
        user.save();
        cb(false, "Your password has been succesfully reset.");
      }
    }
  );
};

module.exports.updateProfile = (email, newData, cb) => {
  console.log(email);
  User.findOneAndUpdate({ email: email }, newData, (err, res) => {
    if (res == null) {
      console.log("not found");
      cb(null, false);
    } else {
      console.log(res);
      cb(null, true);
    }
  });
};
