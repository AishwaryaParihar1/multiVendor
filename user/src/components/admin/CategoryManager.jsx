import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import SweetAlertService from "../ui/SweetAlertService";

export default function CategoryManager() {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`);
      setCategories(res.data);
    } catch {
      SweetAlertService.showError("Failed to load categories");
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/category`, { name: categoryName.trim() });
      setCategories([...categories, res.data]);
      setCategoryName("");
      SweetAlertService.showSuccess("Category added successfully");
    } catch {
      SweetAlertService.showError("Failed to add category");
    }
  };

  // Start editing a category
  const startEditing = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName("");
  };

  // Save edited category
  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/category/${id}`, { name: editName.trim() });
      await fetchCategories();
      cancelEditing();
      SweetAlertService.showSuccess("Category updated successfully");
    } catch {
      SweetAlertService.showError("Failed to update category");
    }
  };

  // Delete category with confirmation
  const deleteCategory = async (id) => {
    const confirmed = await SweetAlertService.showConfirm(
      "Delete Category?",
      "Are you sure you want to delete this category? This action cannot be undone.",
      "Yes, Delete"
    );
    if (!confirmed) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/category/${id}`);
      await fetchCategories();
      SweetAlertService.showSuccess("Category deleted successfully");
    } catch {
      SweetAlertService.showError("Failed to delete category");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Manage Product Categories
        </Typography>

        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            label="New Category Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            disabled={!!editingCategory}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            disabled={!categoryName.trim() || !!editingCategory}
          >
            Add
          </Button>
        </Stack>

        <List
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 2, fontStyle: "italic" }}>
              No categories added yet.
            </Typography>
          ) : (
            categories.map((cat) => (
              <ListItem
                key={cat._id}
                secondaryAction={
                  editingCategory === cat._id ? (
                    <>
                      <IconButton edge="end" aria-label="save" onClick={() => saveEdit(cat._id)} disabled={!editName.trim()}>
                        <Check color={!editName.trim() ? "disabled" : "success"} />
                      </IconButton>
                      <IconButton edge="end" aria-label="cancel" onClick={cancelEditing}>
                        <Close color="error" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton edge="end" aria-label="edit" onClick={() => startEditing(cat)}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteCategory(cat._id)}>
                        <Delete color="error" />
                      </IconButton>
                    </>
                  )
                }
              >
                {editingCategory === cat._id ? (
                  <TextField
                    variant="standard"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    fullWidth
                    autoFocus
                  />
                ) : (
                  <ListItemText primary={cat.name} />
                )}
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}
