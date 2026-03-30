const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

//MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://jrevdelarosa:Delarosa@cluster0.l33ooxq.mongodb.net/MyNewDatabase?retryWrites=true&w=majority";
const DATABASE_NAME = "MyNewDatabase";

const app = express();
app.use(express.json());

//Enable CORS For Frontend 
app.use(
  cors({
    origin: "https://awesometodos-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

let db, todosCollection;

// Connect to MongoDB
async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DATABASE_NAME);
  todosCollection = db.collection("todos");
  console.log("✅ Connected to MongoDB Atlas");
}

// ---------- ROUTES ----------

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await todosCollection.find().toArray();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// POST new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { todo, status } = req.body;
    if (!todo) return res.status(400).json({ error: "Todo is required" });

    const newTodo = {
      todo,
      status: status ?? false,
      createdAt: new Date(),
    };

    const result = await todosCollection.insertOne(newTodo);
    res.status(201).json({ ...newTodo, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

    const { todo, status } = req.body;
    const updateFields = {};
    if (todo !== undefined) updateFields.todo = todo;
    if (status !== undefined) updateFields.status = status;

    if (Object.keys(updateFields).length === 0)
      return res.status(400).json({ error: "No fields to update" });

    const result = await todosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Todo not found" });

    res.json({ acknowledged: result.acknowledged, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

    const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Todo not found" });

    res.json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
}

startServer();