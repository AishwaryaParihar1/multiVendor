import React, { useState } from "react";
import { Search } from "lucide-react";
import { Box, InputBase, IconButton, useTheme } from "@mui/material";

export default function SearchBar({ onSearch }) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) onSearch(searchTerm.trim());
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        maxWidth: 400,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        p: 1,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
        alignItems: "center",
      }}
    >
      <InputBase
        placeholder="Search for products or services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        inputProps={{ "aria-label": "Search products or services" }}
        sx={{
          flex: 1,
          fontSize: "1rem",
          color: theme.palette.text.primary,
          pl: 1,
          "& .MuiInputBase-input::placeholder": {
            color: theme.palette.text.disabled,
          },
        }}
      />
      <IconButton
        type="submit"
        aria-label="Submit search"
        sx={{
          backgroundColor: theme.palette.accent?.main ?? theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          ml: 1,
          p: 1,
          "&:hover": {
            backgroundColor: theme.palette.accent?.dark ?? theme.palette.primary.dark,
          },
        }}
      >
        <Search size={20} />
      </IconButton>
    </Box>
  );
}
