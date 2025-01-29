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
  const [gamelists, setUserGamelists] = useState<Array<Schema["gamelist"]["type"]>>([]);

  async function listUserGameLists() {
    const userAttributes = await fetchUserAttributes();
    const userId = userAttributes.sub as string;

    client.models.gamelist?.observeQuery(
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

  function handleCreateGameListButton() {
    const gameListName = (document.getElementById("newGameListName") as HTMLInputElement).value;
    const gameListIsPublic = !(document.getElementById("newGameListIsPrivate") as HTMLInputElement).checked;

    if (gameListName == "") {
      console.log("Game List Name cannot be empty!");
      window.alert("Game List Name cannot be empty!");
      return;
    }

    createGameList(gameListName, gameListIsPublic, []);
  }

  async function createGameList(listname: string, ispublic: boolean, tags: string[]) {
    console.log("Creating new game list with name: " + listname);

    try {
      const userAttributes = await fetchUserAttributes();
      const userId = userAttributes.sub as string;

      await client.models.gamelist.create({
        ispublic: ispublic,
        tags: tags,
        listname: listname,
        userId: userId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <Authenticator signUpAttributes={["preferred_username"]}>
        <div>
          <h1>My Game Lists</h1>
          <div>
            <table>
              <tbody>
                <tr>
                  <td align="right">
                    <label>Game List Name</label>
                  </td>
                  <td align="left">
                    <input id="newGameListName" />
                  </td>
                </tr>
                <tr>
                  <td align="right">
                    <label>Private Game List</label>
                  </td>
                  <td align="left">
                    <input type="checkbox" id="newGameListIsPrivate" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} align="center">
                    <button onClick={handleCreateGameListButton}>Add Game List</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <tbody>
                {gamelists.map((gamelists) => (
                  <tr>
                    <td align="right">
                      <label>{gamelists.listname}</label>
                    </td>
                    <td align="left">
                      <Link
                        href={{
                          pathname: "/gamelist",
                          query: { id: gamelists.id },
                        }}
                      >
                        <button>Open</button>
                      </Link>
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
