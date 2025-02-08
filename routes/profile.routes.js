const express = require("express");
const router = express.Router();
const userModal = require("../models/register.model");
const upload = require("../config/multer");

const VerifyUser = require("../utils/get-verify-user.util");

// Profile View Page
router.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  const user = await VerifyUser(token);

  res.render("profile", { user });
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
  upload.single("profilePicture"),
  async (req, res) => {
    const token = req.cookies.token;
    const user = await VerifyUser(token);

    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const userId = user._id;

      const profilePictureUrl = `/uploads/${req.file.filename}`;

      await userModal.findByIdAndUpdate(userId, {
        profilePicture: profilePictureUrl,
      });

      res.redirect("/profile");
    } catch (error) {
      console.error("Upload error:", error);
    }
  }
);

module.exports = router;
