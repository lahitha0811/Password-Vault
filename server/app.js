const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Load env
dotenv.config({ path: path.join(__dirname, "config.env") });

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// DB
require("./db/connection");

// Test Route
app.get("/", (req, res) => {
  res.send("Password Vault Backend Running");
});

// Routes
app.use(require("./router/routing"));

// Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});