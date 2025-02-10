const express = require("express");
const router = express.Router();
const blogModel = require("../models/blog.model");
const VerifyUser = require("../utils/get-verify-user.util");
const multer = require("multer");
const { blogImageStorage } = require("../storage/storage");
const upload = multer({ storage: blogImageStorage });

router.get("/blogs", async (req, res) => {
  const token = req.cookies.token;
  const user = await VerifyUser(token);
  const allBlogModel = (await blogModel.find().where()).reverse();
  res.render("blogs", { user, blogs: allBlogModel });
});

router.get("/add-blog", async (_, res) => res.render("add-blog"));

router.post("/add-blog", upload.single("image"), async (req, res) => {
  const { title, content, image } = req.body;

  const token = req.cookies.token;
  const user = await VerifyUser(token);

  const authorId = user._id;
  const authorName = user.name;
  const authorProfile = user.profilePicture;

  await blogModel.create({
    title,
    content,
    image: req.file?.path,
    authorId,
    authorName,
    authorProfile,
  });

  res.redirect("/blogs");
});

module.exports = router;
