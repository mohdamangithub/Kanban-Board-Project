const express = require("express");
const cors = require("cors");
const Task = require("./models/Task");
const connectDB = require("./db/db");
const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
connectDB()

// ✅ Routes
app.get("/get", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/add", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

app.put("/update/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.put("/delete/:id", async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id, req.body, { new: true });
  res.json(deleted);
});

app.delete("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port " + 3000));
