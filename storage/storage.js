const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-pictures",
    allowedFormats: ["jpeg", "png", "jpg"],
    transformation: [{ width: 200, height: 200, crop: "fill" }],
  },
});

module.exports = {
  profileStorage,
};
