const express = require("express");
const router = express.Router();
const verifyUser = require("../utils/get-verify-user.util");
const userModal = require("../models/register.model");
const blogModal = require("../models/blog.model");

router.get("/writers", async (req, res) => {
  const token = req.cookies.token;
  const user = await verifyUser(token);
  const writers = await userModal.find();

  res.render("writers", {
    user,
    writers,
  });
});

router.get("/writer/:id", async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.token;
  const user = await verifyUser(token);
  const writer = await userModal.findById(id);
  const blogs = await blogModal.find({ authorId: id });

  res.render("writer/slug", {
    user,
    writer,
    blogs,
  });
});

module.exports = router;
