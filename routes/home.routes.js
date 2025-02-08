const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userModel = require("../models/register.model");

router.get("/", async (req, res) => {
  const token = req.cookies.token;

  let user;
  let isValidUser;

  if (token) isValidUser = jwt.verify(token, process.env.JWT_SECRET);
  if (isValidUser) user = await userModel.findOne({ email: isValidUser.email });

  res.render("index", {
    user,
  });
});

module.exports = router;
