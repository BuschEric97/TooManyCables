"use client";

import Link from "next/link";
import {
  fetchUserAttributes
} from "@aws-amplify/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { EnumType } from "@aws-amplify/data-schema";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const searchParams = useSearchParams();
  const listId = searchParams.get("id") as string;

  const [games, setListGames] = useState<Array<Schema["game"]["type"]>>([]);

  async function listListGames() {
    client.models.game?.observeQuery(
      {filter: {
        collectionId: {
          eq: listId
        }
      }}
    ).subscribe({
      next: (data) => setListGames([...data.items]),
    });
  }

  useEffect(() => {
    listListGames();
  }, []);

  function handleCreateGameButton() {
    createGame(window.prompt("Game Name") as string);
  }

  async function createGame(name: string) {
    console.log("Creating new game with name: " + name);

    try {
      const userAttributes = await fetchUserAttributes();
      const userId = userAttributes.sub as string;

      const newGame = await client.models.game.create({
        name: name,
        collectionId: listId
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <h1>TMC Game List Viewer</h1>
      <Suspense>
        <button onClick={handleCreateGameButton}>New Game</button>
        <div>
          {games.map((games) => (
            <div>{games.name}</div>
          ))}
        </div>
      </Suspense>
      <Link href="/"><button>Home</button></Link>
    </main>
  );
}