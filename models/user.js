const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = (module.exports = mongoose.model("User", UserSchema));
module.exports.registerUser = (req, res) => {
  console.log(res);
};
module.exports.getUserByEmail = async (email, cb) => {
  User.findOne({ email: email }, cb);
};

module.exports.verifyPassword = (old_password, givenPassword, callback) => {
  if (old_password == givenPassword) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
