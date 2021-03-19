const User = require("../database/models/User");

exports.createUser = (email, password) => {
  const newUser = new User({
    email,
    password,
  });
  return newUser.save();
};

exports.getUser = (email) => {
  return User.findOne({ email });
};
