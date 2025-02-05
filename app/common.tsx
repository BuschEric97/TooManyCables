import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export const platformList: { [key: string]: string } = {
  "OTHER": "Other",
  "NES": "NES",
  "SNES": "SNES",
  "N64": "Nintendo 64",
  "GCN": "GameCube",
  "WII": "Wii",
  "WIIU": "Wii U",
  "NSW": "Nintendo Switch",
  "NSW2": "Nintendo Switch 2",
  "GB": "Game Boy",
  "GBC": "Game Boy Color",
  "VB": "Virtual Boy",
  "GBA": "Game Boy Advance",
  "DS": "Nintendo DS",
  "3DS": "Nintendo 3DS",
  "N3DS": "New Nintendo 3DS",
  "PS1": "PlayStation",
  "PS2": "PlayStation 2",
  "PS3": "PlayStation 3",
  "PS4": "PlayStation 4",
  "PS5": "PlayStation 5",
  "PSP": "PlayStation Portable",
  "PSVT": "PlayStation Vita",
  "XBOX": "Original Xbox",
  "X360": "Xbox 360",
  "XBX1": "Xbox One",
  "XBXS": "Xbox Series X|S",
  "SMS": "Sega Master System",
  "SGNS": "Sega Genesis/Mega Drive",
  "STRN": "Sega Saturn",
  "DCST": "Sega Dreamcast",
  "SGG": "Sega Game Gear",
  "PC": "PC Game",
  "STM": "Steam",
};

export const statusList: { [key: string]: string } = {
  "NYP": "Unplayed",
  "UNF": "Unfinished",
  "CPL": "Completed",
  "FPL": "100% Completed",
  "NDL": "Endless",
};

export async function createGame(listId: string, name: string, platform: string, status: string, notes: string) {
  console.log("Creating new game with name: " + name);

  try {
    switch (status) {
      case "NYP":
      case "UNF":
      case "CPL":
      case "FPL":
      case "NDL":
        await client.models.game.create({
          name: name,
          platform: platform,
          status: status,
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

export async function editGame(gameId: string, gameName: string, gamePlatform: string, gameStatus: string, gameNotes: string) {
  console.log("Updating game with id: " + gameId);

  try {
    switch (gameStatus) {
      case "NYP":
      case "UNF":
      case "CPL":
      case "FPL":
      case "NDL":
        await client.models.game.update({
          id: gameId,
          platform: gamePlatform,
          status: gameStatus,
          notes: gameNotes,
          name: gameName,
        })
        break;
      default:
        console.log("Unknown status entered: " + gameStatus);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteGame(gameId: string) {
  console.log("Deleting game with id: " + gameId);

  try {
    await client.models.game.delete({ id: gameId });
  } catch (error) {
    console.log(error);
  }
}

export async function createGameList(userId: string, listname: string, ispublic: boolean, tags: string[]) {
  console.log("Creating new game list with name: " + listname);

  try {
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

export async function deleteGamesByGameListId(listId: string) {
  console.log("Deleting all games belonging to game list with id: " + listId);

  try {
    let games = await client.models.game.list({
      filter: {
        collectionId: {
          eq: listId
        }
      }
    });

    games.data.forEach(async (game) => {
      console.log("Deleting game with id: " + game.id);
      await client.models.game.delete({
        id: game.id
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteGameList(listId: string) {
  console.log("Deleting game list with id: " + listId);

  try {
    await client.models.gamelist.delete({ id: listId });
  } catch (error) {
    console.log(error);
  }
}