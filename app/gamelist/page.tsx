"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContainer, toast, ToastContentProps } from "react-toastify";
import "./../../app/app.css";
import {
  platformList,
  statusList,
  createGame,
  editGame,
  deleteGame,
} from "./../../app/common";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

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

    createGame(listId, gameName, gamePlatform, gameStatus, gameNotes);

    toast.success("Game created successfully!");
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

    toast.success("Game updated successfully!");
  }

  function handleDeleteGameButton(e: React.MouseEvent<HTMLButtonElement>) {
    const gameId = (e.target as HTMLButtonElement).name;
    
    toast(deletionConfirmationToast, {
      onClose (reason) {
        if (reason === "yes") {
          deleteGame(gameId);
          toast.success("Game deleted successfully!");
        }
      },
      position: "bottom-center"
    });
  }

  function deletionConfirmationToast({ closeToast }: ToastContentProps) {
    return ( 
      <div>
        Are you sure?
        <button onClick={() => closeToast("yes")}>Yes</button>
        <button onClick={() => closeToast("no")}>No</button>
      </div>
    )
  }

  return (
    <main>
      <div className="desktopHorizontal">
        <div className="vertical">
          <h1>Game List Details</h1>
        </div>
        <div className="vertical">
          <div id="sectionGameList" className="vertical">
            <h1>Games</h1>
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th></th>
                  <th></th>
                </tr>
                {games.map((games) => (
                  <tr key={games.id}>
                    <td>
                      {games.name}
                    </td>
                    <td>
                      {platformList[games.platform as string]}
                    </td>
                    <td>
                      {statusList[games.status as string]}
                    </td>
                    <td>
                      <button name={games.id} onClick={handleOpenGameButton}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button name={games.id} onClick={handleDeleteGameButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button id="buttonAddNewGame" onClick={handleAddGameCollapse}>
              Add New Game
            </button>
          </div>
          <div id="sectionAddNewGame" className="collapsible bordered vertical">
            <h2>Add New Game Details</h2>
            <div className="horizontal">
              <label>Game Name</label>
              <input id="newGameName" />
            </div>
            <div className="horizontal">
              <label>Platform</label>
              <select id="newGamePlatform">
                <option value="">--Please select an Option--</option>
                {Object.keys(platformList).map((platformId) => (
                  <option key={platformId} value={platformId}>{platformList[platformId]}</option>
                ))}
              </select>
            </div>
            <div className="horizontal">
              <label>Completion Status</label>
              <select id="newGameStatus">
                {Object.keys(statusList).map((statusId) => (
                  <option key={statusId} value={statusId}>{statusList[statusId]}</option>
                ))}
              </select>
            </div>
            <div className="vertical">
              <label>Notes</label>
              <textarea rows={10} cols={30} id="newGameNotes" />
            </div>
            <button onClick={handleCreateGameButton}>Add Game</button>
          </div>
          <div id="sectionGameDetails" className="collapsible bordered vertical">
            <input className="hiddenData" readOnly id="gameId" />
            <h2>Edit Game Details</h2>
            <div className="horizontal">
              <label>Game Name</label>
              <input id="gameName" />
            </div>
            <div className="horizontal">
              <label>Platform</label>
              <select id="gamePlatform">
                {Object.keys(platformList).map((platformId) => (
                  <option key={platformId} value={platformId}>{platformList[platformId]}</option>
                ))}
              </select>
            </div>
            <div className="horizontal">
              <label>Completion Status</label>
              <select id="gameStatus">
                {Object.keys(statusList).map((statusId) => (
                  <option key={statusId} value={statusId}>{statusList[statusId]}</option>
                ))}
              </select>
            </div>
            <div className="vertical">
              <label>Notes</label>
              <textarea rows={10} cols={30} id="gameNotes" />
            </div>
            <button onClick={handleEditGameButton}>Save Changes</button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </main>
  );
}