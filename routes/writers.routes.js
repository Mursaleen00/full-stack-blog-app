const express = require("express");
const router = express.Router();
const verifyUser = require("../utils/get-verify-user.util");
const userModal = require("../models/register.model");

router.get("/writers", async (req, res) => {
  const token = req.cookies.token;
  const user = await verifyUser(token);
  const writers = await userModal.find({});
  res.render("writers", {
    user,
    writers,
  });
});

router.get("/writer/:id", async (req, res) => {
  const token = req.cookies.token;
  const user = await verifyUser(token);
  const writer = await userModal.findById(req.params.id);

  res.render("writer/slug", {
    user,
    writer,
  });
});

module.exports = router;
