const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    default: "https://placehold.co/600x400",
  },

  authorId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorProfile: {
    type: String,
    required: true,
  },
});

const BlogModel = mongoose.model("blogs", BlogSchema);

module.exports = BlogModel;
