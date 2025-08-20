import React from "react";
import { Chip, useTheme } from "@mui/material";

export default function CategoryChips({ categories, onCategoryClick }) {
  const theme = useTheme();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          variant="outlined"
          onClick={() => onCategoryClick(category)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCategoryClick(category);
          }}
          tabIndex={0}
          role="button"
          sx={{
            cursor: "pointer",
            borderColor: theme.palette.accent?.main ?? "#CBAF7A",
            color: theme.palette.accent?.main ?? "#CBAF7A",
            fontWeight: 600,
            fontSize: "0.9rem",
            "&:hover": {
              backgroundColor: theme.palette.accent?.main ?? "#CBAF7A",
              color: theme.palette.background.default,
              boxShadow: "0 5px 12px rgba(203,175,122,0.3)",
              borderColor: theme.palette.accent?.main ?? "#CBAF7A",
            },
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
