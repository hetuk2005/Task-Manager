const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth"); // ✅ REQUIRED

const app = express();

app.use(cors());
app.use(express.json());

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ROUTES
app.use("/api/auth", authRoutes); // ✅ VERY IMPORTANT

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const taskRoutes = require("./routes/task");
app.use("/api/tasks", taskRoutes);