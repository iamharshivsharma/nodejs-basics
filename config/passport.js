const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("./database");
const passport = require("passport");

module.exports = (passport) => {
  console.log("in passport function");
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload, "payload");
      //   return done(null, false);
      User.getUserById(jwt_payload._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          console.log(user);
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
