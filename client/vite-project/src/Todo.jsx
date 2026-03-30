export default function Todo({ todo, setTodos, backendUrl }) {
  // Toggle status immediately (optimistic UI)
  const updateTodo = async (todoId, currentStatus) => {
    // Optimistic UI update
    setTodos((curr) =>
      curr.map((t) =>
        t._id === todoId ? { ...t, Status: !t.Status } : t
      )
    );

    try {
      await fetch(`${backendUrl}/api/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: !currentStatus }),
      });
    } catch (err) {
      console.error("Failed to update todo:", err);
      // Revert on error
      setTodos((curr) =>
        curr.map((t) =>
          t._id === todoId ? { ...t, Status: currentStatus } : t
        )
      );
    }
  };

  // Delete todo
  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`${backendUrl}/api/todos/${todoId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.acknowledged)
        setTodos((curr) => curr.filter((t) => t._id !== todoId));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return (
    <div className="todo">
      <p>{todo.todo}</p>
      <button onClick={() => updateTodo(todo._id, todo.Status)}>
        {todo.Status ? "☑" : "☐"}
      </button>
      <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
    </div>
  );
}