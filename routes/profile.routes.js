const express = require("express");
const router = express.Router();
const userModal = require("../models/register.model");
const blogsModal = require("../models/blog.model");

const VerifyUser = require("../utils/get-verify-user.util");

const { profileStorage } = require("../storage/storage");
const multer = require("multer");
const upload = multer({ storage: profileStorage });

// Profile View Page
router.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  const user = await VerifyUser(token);

  res.render("profile", { user });
});

router.post("/profile/delete", async (req, res) => {
  const token = req.cookies.token;
  const user = await VerifyUser(token);

  const userId = user._id;
  await userModal.findByIdAndDelete(userId);

  res.clearCookie("token");
  req.session.destroy();
  res.redirect("/");
});

// Edit Profile Page
router.get("/profile/edit", async (req, res) => {
  const token = req.cookies.token;
  const user = await VerifyUser(token);

  res.render("editProfile", { user });
});

router.post("/update-profile", async (req, res) => {
  const { email, name } = req.body;
  const token = req.cookies.token;
  const user = await VerifyUser(token);

  const userId = user._id;

  await userModal.findByIdAndUpdate(userId, {
    email,
    name,
  });

  res.redirect("/profile");
});

router.post(
  "/upload-profile-picture",
  upload.single("image"),
  async (req, res) => {
    const token = req.cookies.token;
    const user = await VerifyUser(token);
    const userId = user._id;

    await blogsModal.updateMany(
      { authorId: userId },
      {
        authorProfile: req.file.path,
      }
    );

    await userModal.findByIdAndUpdate(userId, {
      profilePicture: req.file.path,
    });

    res.redirect("/profile");
  }
);

module.exports = router;
