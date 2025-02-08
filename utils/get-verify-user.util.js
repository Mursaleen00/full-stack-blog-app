const jwt = require("jsonwebtoken");
const userModal = require("../models/register.model");

async function VerifyUser(token) {
  let user;
  let validUser;

  if (token) validUser = jwt.verify(token, process.env.JWT_SECRET);
  if (validUser) user = await userModal.findOne({ email: validUser.email });

  return user;
}

module.exports = VerifyUser;
