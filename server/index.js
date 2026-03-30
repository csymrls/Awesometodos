require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const router = require("./routes");
const { connectToMongoDB } = require("./database");

const app = express();

app.use(express.json());
app.use(cors());

// API routes FIRST
app.use("/api/todos", router);

// Correct Vite build path
const clientPath = path.resolve(__dirname, "../client/vite-project/dist");

if (fs.existsSync(path.join(clientPath, "index.html"))) {
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });

  console.log("Serving frontend from:", clientPath);
} else {
  console.log(" Frontend build not found.");
  console.log(" Run: cd client/vite-project && npm run build");
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectToMongoDB();
  console.log("✅ Connected to MongoDB Atlas");

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();