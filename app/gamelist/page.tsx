"use client";

import Link from "next/link";
import {
  fetchUserAttributes
} from "@aws-amplify/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
    const gameName = (document.getElementById("newGameName") as HTMLInputElement).value;
    const gamePlatform = (document.getElementById("newGamePlatform") as HTMLSelectElement).value;
    const gameStatus = (document.getElementById("newGameStatus") as HTMLSelectElement).value;
    const gameNotes = (document.getElementById("newGameNotes") as HTMLInputElement).value;

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

  return (
    <main>
      <h1>TMC Game List Viewer</h1>
      <div>
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
                  <option value="OTHER">--Other--</option>
                  <option value="NES">NES</option>
                  <option value="SNES">SNES</option>
                  <option value="N64">Nintendo 64</option>
                  <option value="GCN">GameCube</option>
                  <option value="WII">Wii</option>
                  <option value="WIIU">Wii U</option>
                  <option value="NSW">Nintendo Switch</option>
                  <option value="NSW2">Nintendo Switch 2</option>
                  <option value="GB">Game Boy</option>
                  <option value="GBC">Game Boy Color</option>
                  <option value="VB">Virtual Boy</option>
                  <option value="GBA">Game Boy Advance</option>
                  <option value="DS">Nintendo DS</option>
                  <option value="3DS">Nintendo 3DS</option>
                  <option value="N3DS">New Nintendo 3DS</option>
                  <option value="PS1">PlayStation</option>
                  <option value="PS2">PlayStation 2</option>
                  <option value="PS3">PlayStation 3</option>
                  <option value="PS4">PlayStation 4</option>
                  <option value="PS5">PlayStation 5</option>
                  <option value="PSP">PlayStation Portable</option>
                  <option value="PSVT">PlayStation Vita</option>
                  <option value="XBOX">Original Xbox</option>
                  <option value="X360">Xbox 360</option>
                  <option value="XBX1">Xbox One</option>
                  <option value="XBXS">Xbox Series X|S</option>
                  <option value="SMS">Sega Master System</option>
                  <option value="SGNS">Sega Genesis</option>
                  <option value="STRN">Sega Saturn</option>
                  <option value="DCST">Sega Dreamcast</option>
                  <option value="SGG">Sega Game Gear</option>
                  <option value="PC">PC Game</option>
                  <option value="STM">Steam</option>
                </select>
              </td>
            </tr>
            <tr>
              <td align="right">
                <label>Completion Status</label>
              </td>
              <td align="left">
                <select id="newGameStatus">
                  <option value="NYP">Unplayed</option>
                  <option value="UNF">Unfinished</option>
                  <option value="CPL">Completed</option>
                  <option value="FPL">100% Completed</option>
                  <option value="NDL">Endless</option>
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
                <button onClick={handleCreateGameButton}>New Game</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {games.map((games) => (
          <div>{games.name}</div>
        ))}
      </div>
      <Link href="/"><button>Home</button></Link>
    </main>
  );
}