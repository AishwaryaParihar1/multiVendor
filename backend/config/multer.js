// backend/config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",       // optional: all images will be saved in this folder
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage: storage });

module.exports = parser;
