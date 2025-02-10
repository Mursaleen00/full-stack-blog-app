const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userModel = require("../models/register.model");
const VerifyUser = require("../utils/get-verify-user.util");

router.get("/", async (req, res) => {
  const token = req.cookies.token;

  const user = await VerifyUser(token);

  res.render("index", {
    user,
  });
});

module.exports = router;
