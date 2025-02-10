const express = require("express");
const router = express.Router();
const VerifyUser = require("../utils/get-verify-user.util");
const blogModel = require("../models/blog.model");
const userModal = require("../models/register.model");

router.get("/", async (req, res) => {
  const token = req.cookies.token;

  const user = await VerifyUser(token);

  const allBlogModel = (await blogModel.find().where()).reverse().splice(0, 6);
  const writers = (await userModal.find().where()).splice(0, 6).reverse();

  res.render("index", {
    user,
    allBlogModel,
    writers,
  });
});

module.exports = router;
