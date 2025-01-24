"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createGame() {
    client.models.Todo.create({
      content: window.prompt("Game"),
    });
  }

  function deleteGame(id: string) {
    client.models.Todo.delete({id})
  }

  return (
    <main>
      <h1>Too Many Cables</h1>
      <button onClick={createGame}>Add Game</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteGame(todo.id)}
            key={todo.id}
          >{todo.content}</li>
        ))}
      </ul>
    </main>
  );
}
