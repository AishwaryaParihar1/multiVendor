import React, { useState, useEffect } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { PlusCircle, Loader2 } from "lucide-react";
import Select from "react-select";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    mrp: "",
    sellingPrice: "",
    images: [], // holds Cloudinary URLs array
    categories: [], // selected categories for product
    isTrending: false,
    isNewArrival: false,
    isBestSeller: false,
  });
  const [uploading, setUploading] = useState(false);
  const [allCategories, setAllCategories] = useState([]); // all available categories

  // Fetch available categories from backend on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/category`
        );
        // Map categories to react-select format
        const options = res.data.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }));
        setAllCategories(options);
      } catch (err) {
        SweetAlertService.showError("Failed to load categories");
      }
    }
    fetchCategories();
  }, []);

  // Handle input fields except categories
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle categories multi-select change for react-select
  const handleCategoryChange = (selectedOptions) => {
    setForm({
      ...form,
      categories: selectedOptions ? selectedOptions.map((o) => o.value) : [],
    });
  };

  // Multiple Images Upload to Cloudinary (same as before)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      let uploadedImages = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/vendor/upload-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadedImages.push(res.data.imageUrl);
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      SweetAlertService.showSuccess("Images uploaded!");
    } catch {
      SweetAlertService.showError("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // Remove image from preview
  const handleRemoveImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Handle submit with optional validation for prices
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.sellingPrice) > Number(form.mrp)) {
      SweetAlertService.showError("Selling Price cannot be greater than MRP.");
      return;
    }

    if (form.categories.length === 0) {
      SweetAlertService.showError("Please select at least one category.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/products`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      SweetAlertService.showSuccess("Product added successfully!");
      setForm({
        name: "",
        description: "",
        mrp: "",
        sellingPrice: "",
        images: [],
        categories: [],
      });
    } catch {
      SweetAlertService.showError("Failed to add product.");
    }
  };

  // Custom styles for react-select to harmonize with tailwind CSS theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "0.5rem", // rounded-lg
      borderColor: state.isFocused ? "#CBAF7A" : "#D1D5DB", // accent on focus, gray otherwise
      boxShadow: state.isFocused ? "0 0 0 2px #CBAF7A" : "none",
      "&:hover": {
        borderColor: "#CBAF7A",
      },
      minHeight: "44px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#8D6749", // primary
      color: "white",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      zIndex: 9999, // Ensure dropdown overlays properly
    }),
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center flex items-center justify-center gap-2">
        <PlusCircle size={28} /> Add New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-semibold text-primary">
            Product Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-primary">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your product"
            required
            rows={3}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent transition resize-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-primary">
            Maximum Retail Price (MRP)
          </label>
          <input
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.01"
            placeholder="MRP (₹)"
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-primary">
            Selling Price
          </label>
          <input
            name="sellingPrice"
            value={form.sellingPrice}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.01"
            placeholder="Selling Price (₹)"
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-primary">
            Product Categories
          </label>
          <Select
            isMulti
            options={allCategories}
            value={allCategories.filter((c) =>
              form.categories.includes(c.value)
            )}
            onChange={handleCategoryChange}
            placeholder="Select categories..."
            styles={customStyles}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <label className="flex items-center gap-2 font-semibold text-accent">
            <input
              type="checkbox"
              checked={form.isTrending}
              onChange={(e) =>
                setForm({ ...form, isTrending: e.target.checked })
              }
            />
            Trending
          </label>
          <label className="flex items-center gap-2 font-semibold text-accent">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) =>
                setForm({ ...form, isNewArrival: e.target.checked })
              }
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 font-semibold text-accent">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) =>
                setForm({ ...form, isBestSeller: e.target.checked })
              }
            />
            Best Seller
          </label>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-primary">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg bg-background"
          />
          {uploading && (
            <div className="mt-2 flex items-center gap-2 text-accent">
              <Loader2 className="animate-spin" /> Uploading...
            </div>
          )}
          {form.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`product-${idx}`}
                    className="rounded-xl border shadow h-32 object-cover w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full shadow opacity-80 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 font-semibold text-white rounded-lg bg-primary hover:bg-secondary transition-colors text-lg"
        >
          {uploading ? "Please wait..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
