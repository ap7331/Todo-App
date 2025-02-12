const express = require("express");
const fs = require("fs"); // For interacting with the file system
const bodyParser = require("body-parser"); // For parsing JSON request bodies
const app = express();

// Middleware to parse request body as JSON
app.use(bodyParser.json());

// Initialize todos array from the file if it exists, or as an empty array
let todos = [];
const TODO_FILE = "todo.json";

// Function to load todos from the file
function loadTodos() {
  if (fs.existsSync(TODO_FILE)) {
    const data = fs.readFileSync(TODO_FILE, "utf-8");
    todos = JSON.parse(data);
  }
}

// Function to save todos to the file
function saveTodos() {
  fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2), "utf-8");
}

// Load todos at the start of the server
loadTodos();

// POST request to add a new todo
app.post("/", function (req, res) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const id = Math.random().toString(36).substr(2, 9); // Generate random ID

  todos.push({ id, title });
  saveTodos(); // Save updated todos to file

  res.status(201).json({ message: "Todo added", todo: { id, title } });
});

// DELETE request to remove a todo by ID
app.delete("/:id", function (req, res) {
  const { id } = req.params;

  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(index, 1);
  saveTodos(); // Save updated todos to file

  res.json({ message: "Todo deleted" });
});

// GET request to return all todos
app.get("/", function (req, res) {
  res.json({ todos });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
