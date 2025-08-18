import { useState, useEffect } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService"; // Assuming proper path

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from backend
  const fetchCategories = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/category`)
      .then(res => setCategories(res.data))
      .catch(() => SweetAlertService.showError("Failed to load categories"));
  };

  // Add new category
  const handleAddCategory = () => {
    if (!categoryName.trim()) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/category`, { name: categoryName.trim() })
      .then(res => {
        setCategories([...categories, res.data]);
        setCategoryName("");
        SweetAlertService.showSuccess("Category added successfully");
      })
      .catch(() => SweetAlertService.showError("Failed to add category"));
  };

  // Start editing a category
  const startEditing = (cat) => {
    setEditingCategory(cat._id);
    setEditName(cat.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName("");
  };

  // Save edited category
  const saveEdit = (id) => {
    if (!editName.trim()) return;
    axios.put(`${import.meta.env.VITE_API_URL}/api/category/${id}`, { name: editName.trim() })
      .then(() => {
        fetchCategories();
        cancelEditing();
        SweetAlertService.showSuccess("Category updated successfully");
      })
      .catch(() => SweetAlertService.showError("Failed to update category"));
  };

  // Delete category with confirmation
  const deleteCategory = async (id) => {
    const confirmed = await SweetAlertService.showConfirm(
      "Delete Category?",
      "Are you sure you want to delete this category? This action cannot be undone.",
      "Yes, Delete"
    );
    if (!confirmed) return;
    axios.delete(`${import.meta.env.VITE_API_URL}/api/category/${id}`)
      .then(() => {
        fetchCategories();
        SweetAlertService.showSuccess("Category deleted successfully");
      })
      .catch(() => SweetAlertService.showError("Failed to delete category"));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800  pb-2">Manage Product Categories</h2>

      <div className="flex mb-6">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="New Category Name"
          className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={editingCategory !== null}
        />
        <button
          onClick={handleAddCategory}
          className={`bg-primary text-white px-5 py-2 rounded-r-md transition-colors ${editingCategory !== null ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"}`}
          aria-label="Add category"
          disabled={editingCategory !== null}
        >
          Add
        </button>
      </div>

      <ul className="max-h-60 overflow-y-auto space-y-2">
        {categories.length === 0 ? (
          <li className="text-gray-500 italic">No categories added yet.</li>
        ) : (
          categories.map((cat) => (
            <li
              key={cat._id}
              className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition"
            >
              {editingCategory === cat._id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-md px-2 py-1 mr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit(cat._id)}
                      className="text-green-600 hover:text-green-800 font-semibold"
                      aria-label="Save edit"
                      title="Save"
                    >
                      ✔️
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-red-600 hover:text-red-800 font-semibold"
                      aria-label="Cancel edit"
                      title="Cancel"
                    >
                      ❌
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => startEditing(cat)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      aria-label="Edit category"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                      aria-label="Delete category"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
