// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dftdmfzjk",   // from your Cloudinary dashboard
  api_key: "982813298546269",
  api_secret: "HPIWK_jzT5r9t4uGeL6SmHK93NE",
});

module.exports = cloudinary;
