// controllers/categoryController.js
const Category = require("../models/Category");
exports.createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const category = new Category({ name, icon, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};


// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, icon, description } = req.body;

    // Find category by id and update
    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { name, icon, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deleted = await Category.findByIdAndDelete(categoryId);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};