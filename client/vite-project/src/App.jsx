import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(""); // State for the new todo input

  useEffect(() => {
    const getTodos = async () => {
      const res = await fetch("/api/todos");
      const todos = await res.json();

      setTodos(todos);
    };

    getTodos();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, status: !currentStatus } : todo
      )
    );

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: !currentStatus }),
      });

      if (!res.ok) {
        // If the backend update fails, revert the UI change
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, status: currentStatus } : todo
          )
        );
        console.error("Failed to update todo status in the backend");
        // Optionally show an error message to the user
      }
    } catch (error) {
      // If there's an error during the fetch, revert the UI change
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, status: currentStatus } : todo
        )
      );
      console.error("Error updating todo status:", error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return; // Prevent adding empty todos

    try {
      // Make a POST request to add the new todo to the backend
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: newTodo, status: false }), // Initial status is false
      });

      if (res.ok) {
        const addedTodo = await res.json();
        setTodos([...todos, addedTodo]);
        setNewTodo("");
      } else {
        console.error("Failed to add todo to the backend");
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      // Optionally show an error message to the user
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      // Make a DELETE request to remove the todo from the backend
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTodos(todos.filter((todo) => todo._id !== id)); // Remove the todo from the UI
      } else {
        console.error("Failed to delete todo from the backend");
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <main className="container">
      <h1 className="title" style={{ textAlign: 'center' }}>Awesome Todos</h1>

      {/* Input form for adding new todos */}
      <div className="add-todo-form" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{ flex: '0 0 50%', marginRight: '15px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} // Adjust size and style
        />
        <button onClick={handleAddTodo} style={{ backgroundColor: 'purple', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer', borderRadius: '5px' }}>Add Todo</button>
      </div>

      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <div key={todo._id} className="todo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
              <p style={{ margin: 0 }}>{todo.todo}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  className="todo__status"
                  onClick={() => handleStatusChange(todo._id, todo.status)}
                  style={{ marginRight: '5px', fontSize: '1.2em', border: 'none', background: 'none', cursor: 'pointer' }} // Adjust size and style
                >
                  {todo.status ? "☑" : "☐"}
                </button>
                <button className="todo__delete" onClick={() => handleDeleteTodo(todo._id)} style={{ fontSize: '1.2em', border: 'none', background: 'none', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}