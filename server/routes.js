const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

// Helper to get collection
const getCollection = () => {
  const client = getConnectedClient();
  return client.db("MyNewDatabase").collection("todos"); // ← must match your Atlas DB
};

// GET /api/todos
router.get("/", async (req, res) => {
  try {
    const collection = getCollection();
    const todos = await collection.find().toArray();

    const formatted = todos.map(todo => ({
      _id: todo._id.toString(),
      todo: todo.todo,
      status: todo.status,
      createdAt: todo.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/todos
router.post("/", async (req, res) => {
  try {
    const collection = getCollection();
    let { todo } = req.body;

    if (!todo || todo.trim() === "") {
      return res.status(400).json({ message: "Todo is required" });
    }

    // ensure todo is string
    todo = String(todo);

    const newTodo = {
      todo,
      status: false,
      createdAt: new Date()
    };

    const result = await collection.insertOne(newTodo);

    res.status(201).json({
      _id: result.insertedId.toString(),
      ...newTodo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/todos/:id (update status only)
router.put("/:id", async (req, res) => {
  try {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Invalid status: must be true or false" });
    }

    const result = await collection.updateOne({ _id }, { $set: { status } });

    res.status(200).json({
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
      message: "Todo updated successfully"
    });
  } catch (err) {
    if (err.name === "BSONTypeError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res) => {
  try {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const result = await collection.deleteOne({ _id });

    res.status(200).json({
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;