import { useEffect, useState } from "react";
import { createActor } from "./icp";
import "./App.css"

function App() {
  const[todos , setTodos] = useState([]);
  const[title , setTitle] = useState("");
  const[actor , setActor] = useState(null);
  useEffect(()=>{
    fetchTodos();
  },[]);
  async function fetchTodos() {
    const instance = await createActor();
    console.log("Actor created" , instance);

    if(instance){

      setActor(instance);
      const result = await instance.get_todos();
      console.log(result);
      setTodos(result);
    }
  }
  async function addTodo() {
    await actor.add_todo(title);
    setTitle("");
    fetchTodos();
  }
  async function toggleTodo(id) {
    await actor.toggle_todo(id);
    fetchTodos();
  }
  async function deleteTodo(id) {
    await actor.delete_todo(id);
    fetchTodos();
  }
  return (
    <main className="todo-container">
      <h1>ICP Todo App</h1>
      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTodo} className="add-btn">Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <span>{todo.title}</span>
            <div className="btn-group">
              <button onClick={() => toggleTodo(todo.id)} className="toggle-btn">✔</button>
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">✖</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
