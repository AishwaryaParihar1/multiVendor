import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch vendor products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      SweetAlertService.showError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    const confirm = await SweetAlertService.showConfirm(
      "Delete Product?",
      "Are you sure you want to delete this product? This action cannot be undone.",
      "Yes, Delete",
      "Cancel"
    );
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vendor/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      SweetAlertService.showSuccess("Product deleted.");
      fetchProducts();
    } catch {
      SweetAlertService.showError("Failed to delete product.");
    }
  };

  const handleEdit = (productId) => {
    navigate(`/vendor/dashboard/edit-product/${productId}`);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-7xl mx-auto overflow-x-auto">
      <h2 className="text-primary text-3xl font-bold mb-8 text-center">My Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div className="py-10 text-secondary text-center text-lg">No products found.</div>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-background/60">
              <th className="px-4 py-2 text-left font-bold border-b">Name</th>
              <th className="px-4 py-2 text-left font-bold border-b">Description</th>
              <th className="px-4 py-2 text-left font-bold border-b">MRP</th>
              <th className="px-4 py-2 text-left font-bold border-b">Selling Price</th>
              <th className="px-4 py-2 text-left font-bold border-b">Categories</th>
              <th className="px-4 py-2 text-left font-bold border-b">Images</th>
              <th className="px-4 py-2 text-center font-bold border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-accent/10 group transition">
                <td className="px-4 py-2 border-b">{p.name}</td>
                <td className="px-4 py-2 border-b">{p.description}</td>
                <td className="px-4 py-2 border-b">₹{p.mrp}</td>
                <td className="px-4 py-2 border-b">₹{p.sellingPrice}</td>
                <td className="px-4 py-2 border-b">
                  {p.categories && p.categories.length > 0
                    ? p.categories.join(", ")
                    : <span className="text-gray-400 italic">No categories</span>}
                </td>
                <td className="px-4 py-2 border-b">
                  {p.images && p.images.length > 0 ? (
                    <div className="flex gap-2">
                      {p.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${p.name}-${idx}`}
                          className="h-10 w-10 object-cover rounded border"
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No images</span>
                  )}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <button
                    title="Edit Product"
                    className="p-2 text-primary hover:bg-background/50 rounded transition inline-flex items-center mr-2"
                    onClick={() => handleEdit(p._id)}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    title="Delete Product"
                    className="p-2 text-red-600 hover:bg-background/50 rounded transition inline-flex items-center"
                    onClick={() => handleDelete(p._id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
