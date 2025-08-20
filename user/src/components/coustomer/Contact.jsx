import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
} from "@mui/material";
import ShopHero from "./ShopHero";

export default function Contact() {
  return (
    <>
    <ShopHero/>
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: "bold",
          color: "secondary.main",
          mb: 6,
        }}
      >
        Contact Us
      </Typography>

      <Paper
        elevation={10}
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 4,
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 2,
          "&:hover": {
            boxShadow: (theme) => theme.shadows,
            borderColor: "secondary.main",
          },
          transition: "box-shadow 0.3s ease",
          bgcolor: "background.paper",
        }}
      >
        <form noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Name"
            name="name"
            variant="outlined"
            margin="normal"
            sx={{
              "& label": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            variant="outlined"
            margin="normal"
            sx={{
              "& label": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            name="phone"
            variant="outlined"
            margin="normal"
            sx={{
              "& label": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            name="message"
            variant="outlined"
            margin="normal"
            sx={{
              "& label": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                  boxShadow: (theme) => `0 0 5px ${theme.palette.secondary.main}`,
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1.125rem",
              backgroundColor: "secondary.main",
              "&:hover": {
                backgroundColor: "secondary.dark",
              },
              boxShadow: (theme) => theme.shadows[4],
            }}
          >
            Send Message
          </Button>
        </form>
      </Paper>
    </Box>
    </>
  );
}
