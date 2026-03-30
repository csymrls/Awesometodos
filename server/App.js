const express = require("express");
const app = express();
const port = 3000;

// Parse JSON body
app.use(express.json());

// Import your todos routes
const todosRouter = require("./routes/todos"); // adjust path if needed
app.use("/todos", todosRouter); // this mounts the router

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});