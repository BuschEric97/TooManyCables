"use client";

import Link from "next/link";
import {
  fetchUserAttributes
} from "@aws-amplify/auth";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import { platformList, statusList } from "./../../app/functions";
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

  function handleAddGameCollapse() {
    let content = document.getElementById("sectionAddNewGame") as HTMLDivElement;
    if (content?.style.display === "block") {
      content.style.display = "none";
    } else {
      content!.style.display = "block";
    }
  }

  function handleCreateGameButton() {
    const gameName = (document.getElementById("newGameName") as HTMLInputElement).value;
    const gamePlatform = (document.getElementById("newGamePlatform") as HTMLSelectElement).value;
    const gameStatus = (document.getElementById("newGameStatus") as HTMLSelectElement).value;
    const gameNotes = (document.getElementById("newGameNotes") as HTMLTextAreaElement).value;

    if (gameName == "") {
      console.log("Game Name cannot be empty!");
      window.alert("Game Name cannot be empty!");
      return;
    }

    createGame(gameName, gamePlatform, gameStatus, gameNotes);
  }

  async function createGame(name: string, platform: string, status: string, notes: string) {
    console.log("Creating new game with name: " + name);

    try {
      switch (status) {
        case "NYP":
          await client.models.game.create({
            name: name,
            platform: platform,
            status: "NYP",
            notes: notes,
            collectionId: listId,
          });
          break;
        case "UNF":
          await client.models.game.create({
            name: name,
            platform: platform,
            status: "UNF",
            notes: notes,
            collectionId: listId,
          });
          break;
        case "CPL":
          await client.models.game.create({
            name: name,
            platform: platform,
            status: "CPL",
            notes: notes,
            collectionId: listId,
          });
          break;
        case "FPL":
          await client.models.game.create({
            name: name,
            platform: platform,
            status: "FPL",
            notes: notes,
            collectionId: listId,
          });
          break;
        case "NDL":
          await client.models.game.create({
            name: name,
            platform: platform,
            status: "NDL",
            notes: notes,
            collectionId: listId,
          });
          break;
        default:
          console.log("Unknown status entered: " + status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleOpenGameButton(e: React.MouseEvent<HTMLButtonElement>) {
    const selectedGameId = (e.target as HTMLButtonElement).name;
    let gameDetails = await client.models.game.list({
      filter: {
        id: {
          eq: selectedGameId
        }
      }
    });
    let content = document.getElementById("sectionGameDetails") as HTMLDivElement;
    let gameId = document.getElementById("gameId") as HTMLInputElement;
    let gameName = document.getElementById("gameName") as HTMLInputElement;
    let gamePlatform = document.getElementById("gamePlatform") as HTMLSelectElement;
    let gameStatus = document.getElementById("gameStatus") as HTMLSelectElement;
    let gameNotes = document.getElementById("gameNotes") as HTMLTextAreaElement;

    if (selectedGameId === gameId.value && content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";

      gameId.value = selectedGameId;
      gameName.value = gameDetails.data[0].name;
      gamePlatform.value = gameDetails.data[0].platform as string;
      gameStatus.value = gameDetails.data[0].status as string;
      gameNotes.value = gameDetails.data[0].notes as string;
    }
  }

  function handleEditGameButton() {
    const gameId = document.getElementById("gameId") as HTMLInputElement;
    const gameName = document.getElementById("gameName") as HTMLInputElement;
    const gamePlatform = document.getElementById("gamePlatform") as HTMLSelectElement;
    const gameStatus = document.getElementById("gameStatus") as HTMLSelectElement;
    const gameNotes = document.getElementById("gameNotes") as HTMLTextAreaElement;

    editGame(gameId.value, gameName.value, gamePlatform.value, gameStatus.value, gameNotes.value);
  }

  async function editGame(gameId: string, gameName: string, gamePlatform: string, gameStatus: string, gameNotes: string) {
    console.log("Updating game with id: " + gameId);

    try {
      switch (gameStatus) {
        case "NYP":
          await client.models.game.update({
            id: gameId,
            platform: gamePlatform,
            status: "NYP",
            notes: gameNotes,
            name: gameName,
          })
          break;
        case "UNF":
          await client.models.game.update({
            id: gameId,
            platform: gamePlatform,
            status: "UNF",
            notes: gameNotes,
            name: gameName,
          })
          break;
        case "CPL":
          await client.models.game.update({
            id: gameId,
            platform: gamePlatform,
            status: "CPL",
            notes: gameNotes,
            name: gameName,
          })
          break;
        case "FPL":
          await client.models.game.update({
            id: gameId,
            platform: gamePlatform,
            status: "FPL",
            notes: gameNotes,
            name: gameName,
          })
          break;
        case "NDL":
          await client.models.game.update({
            id: gameId,
            platform: gamePlatform,
            status: "NDL",
            notes: gameNotes,
            name: gameName,
          })
          break;
        default:
          console.log("Unknown status entered: " + status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeleteGameButton(e: React.MouseEvent<HTMLButtonElement>) {
    const gameId = (e.target as HTMLButtonElement).name;

    if (window.confirm("Are you sure?")) {
      deleteGame(gameId);
    }
  }

  async function deleteGame(gameId: string) {
    console.log("Deleting game with id: " + gameId);

    try {
      await client.models.game.delete({ id: gameId });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <div>
        <h1>TMC Game List Viewer</h1>
        <div id="sectionGameList">
          <table>
            <tbody>
              {games.map((games) => (
                <tr key={games.id}>
                  <td align="right">
                    <label>{games.name} for {platformList[games.platform as string]} - {statusList[games.status as string]}</label>
                    <div>{games.notes}</div>
                  </td>
                  <td align="left">
                    <button name={games.id} onClick={handleOpenGameButton}>
                      Edit
                    </button>
                  </td>
                  <td align="left">
                    <button name={games.id} onClick={handleDeleteGameButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button id="buttonAddNewGame" onClick={handleAddGameCollapse}>
          Add New Game
        </button>
        <div id="sectionAddNewGame" className="collapsible">
          <table>
            <tbody>
              <tr>
                <td align="right">
                  <label>Game Name</label>
                </td>
                <td align="left">
                  <input id="newGameName" />
                </td>
              </tr>
              <tr>
                <td align="right">
                  <label>Platform</label>
                </td>
                <td align="left">
                  <select id="newGamePlatform">
                    <option value="">--Please select an Option--</option>
                    {Object.keys(platformList).map((platformId) => (
                      <option key={platformId} value={platformId}>{platformList[platformId]}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td align="right">
                  <label>Completion Status</label>
                </td>
                <td align="left">
                  <select id="newGameStatus">
                    {Object.keys(statusList).map((statusId) => (
                      <option key={statusId} value={statusId}>{statusList[statusId]}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td align="right">
                  <label>Notes</label>
                </td>
                <td align="left">
                  <textarea rows={10} cols={30} id="newGameNotes" />
                </td>
              </tr>
              <tr>
                <td colSpan={2} align="center">
                  <button onClick={handleCreateGameButton}>Add Game</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="sectionGameDetails" className="collapsible">
          <h2>Edit Game Details</h2>
          <input className="hiddenData" readOnly id="gameId" />
          <table>
            <tbody>
              <tr>
                <td align="right">
                  <label>Game Name</label>
                </td>
                <td align="left">
                  <input id="gameName" />
                </td>
              </tr>
              <tr>
                <td align="right">
                  <label>Platform</label>
                </td>
                <td align="left">
                  <select id="gamePlatform">
                    {Object.keys(platformList).map((platformId) => (
                      <option key={platformId} value={platformId}>{platformList[platformId]}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td align="right">
                  <label>Completion Status</label>
                </td>
                <td align="left">
                  <select id="gameStatus">
                    {Object.keys(statusList).map((statusId) => (
                      <option key={statusId} value={statusId}>{statusList[statusId]}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td align="right">
                  <label>Notes</label>
                </td>
                <td align="left">
                  <textarea rows={10} cols={30} id="gameNotes" />
                </td>
              </tr>
              <tr>
                <td colSpan={2} align="center">
                  <button onClick={handleEditGameButton}>Save Changes</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}