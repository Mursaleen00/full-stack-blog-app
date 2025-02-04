const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegisterSchema = new Schema({
  email: {
    required: true,
    unique: true,
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
  },
});

const RegisterModel = mongoose.model("register", RegisterSchema);

module.exports = RegisterModel;
