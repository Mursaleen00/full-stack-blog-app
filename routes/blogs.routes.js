const express = require("express");
const router = express.Router();
const blogModel = require("../models/blog.model");
const VerifyUser = require("../utils/get-verify-user.util");
const multer = require("multer");
const { blogImageStorage } = require("../storage/storage");
const upload = multer({ storage: blogImageStorage });
const moment = require("moment");

router.get("/blogs", async (req, res) => {
  const token = req.cookies.token;
  const search = req.query.search;
  const user = await VerifyUser(token);

  const allBlogModel = (await blogModel.find().where()).reverse();

  const blogs = allBlogModel.filter((blog) => {
    if (search)
      return blog.content.toLowerCase().includes(search.toLowerCase());
    else return allBlogModel;
  });

  res.render("blogs", { user, blogs, search });
});

router.get("/add-blog", async (_, res) => res.render("add-blog"));

router.get("/edit-blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await blogModel.findById(id);
  res.render("blogs/edit", { blog });
});

router.post("/edit-blog/:id", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;

  await blogModel.findByIdAndUpdate(id, {
    title,
    content,
    image: req.file?.path,
  });

  res.redirect("/blogs");
});

router.post("/add-blog", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;

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

router.get("/blogs/:id", async (req, res) => {
  const token = req.cookies.token;
  const id = req.params.id;

  const user = await VerifyUser(token);
  const blog = await blogModel.findById(id);

  const isAuthor = blog.authorId.toString() === user?._id.toString();
  const date = moment(blog?.date).format("LLL");

  res.render("blogs/slug", {
    user,
    blog,
    isAuthor,
    date,
  });
});

router.post("/blog/delete/:id", async (req, res) => {
  const token = req.cookies.token;
  const id = req.params.id;

  const user = await VerifyUser(token);
  await blogModel.findByIdAndDelete(id);
  res.redirect(`/writer/${user._id}`);
});

module.exports = router;
