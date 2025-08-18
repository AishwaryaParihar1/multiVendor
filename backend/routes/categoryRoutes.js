const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, deleteCategory, updateCategory } = require("../controller/categoryController");
// Middlewares for admin protected route lagao yahan
router.post("/", createCategory); // admin only
router.get("/", getAllCategories); // any user

router.put("/:id",updateCategory);

router.delete("/:id", deleteCategory);
module.exports = router;
