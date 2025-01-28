"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import {
  fetchUserAttributes
} from "@aws-amplify/auth";
import Link from "next/link";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [usergamelists, setUserGamelists] = useState<Array<Schema["usergamelists"]["type"]>>([]);

  async function listUserGameLists() {
    const userAttributes = await fetchUserAttributes();
    const userId = userAttributes.sub as string;

    client.models.usergamelists?.observeQuery(
      {filter: {
        userId: {
          eq: userId
        }
      }}
    ).subscribe({
      next: (data) => setUserGamelists([...data.items]),
    });
  }

  useEffect(() => {
    listUserGameLists();
  }, []);

  function openGameList(listId: string) {
    console.log(listId);
  }

  function handleCreateGameListButton() {
    createGameList(window.prompt("List Name") as string);
  }

  async function createGameList(listname: string) {
    console.log("Creating new game list with name: " + listname);

    try {
      const userAttributes = await fetchUserAttributes();
      const userId = userAttributes.sub as string;

      const newGameList = await client.models.usergamelists.create({
        listname: listname,
        userId: userId,
      });
      console.log(newGameList);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <Authenticator signUpAttributes={["preferred_username"]}>
        <div>
          <h1>My Game Lists</h1>
          <button onClick={handleCreateGameListButton}>New Game List</button>
          <div>
            <table>
              <tbody>
                {usergamelists.map((usergamelists) => (
                  <tr>
                    <td align="right">
                      <label>{usergamelists.listname}</label>
                    </td>
                    <td align="left">
                      <button onClick={() => openGameList(usergamelists.id)}>Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Authenticator>
      <Link href="/"><button>Home</button></Link>
    </main>
  );
}
