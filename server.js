const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Serve all static files from the project root
app.use(express.static(__dirname));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/page1", (req, res) => {
  res.sendFile(path.join(__dirname, "page1.html"));
});

app.get("/page2", (req, res) => {
  res.sendFile(path.join(__dirname, "page2.html"));
});

app.get("/page3", (req, res) => {
  res.sendFile(path.join(__dirname, "page3.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "NYOTA-PNGETICH" });
});

app.listen(PORT, () => {
  console.log(`NYOTA server running on port ${PORT}`);
});
