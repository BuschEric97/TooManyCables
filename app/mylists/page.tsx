"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "@aws-amplify/auth";
import Link from "next/link";
import { useState, useEffect, useRef, RefObject } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContainer, toast, ToastContentProps } from "react-toastify";
import "./../../app/app.css";
import {
  createGameList,
  deleteGameList,
  deleteGamesByGameListId
} from "./../../app/common";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [gamelists, setUserGamelists] = useState<Array<Schema["gamelist"]["type"]>>([]);
  let addListButtonRef = useRef<HTMLButtonElement>();

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

  function handleAddGameListCollapse() {
    let content = document.getElementById("sectionAddNewGameList") as HTMLButtonElement;
    if (content?.style.display === "block") {
      content.style.display = "none";
    } else {
      content!.style.display = "block";
    }
  }

  async function handleCreateGameListButton() {
    if (addListButtonRef.current) {
      // Cancel processing if game list is already being created
      if (addListButtonRef.current.getAttribute("disabled")) {
        return;
      }

      addListButtonRef.current.setAttribute("disabled", "disabled");

      // Get game list creation parameters
      const gameListName = (document.getElementById("newGameListName") as HTMLInputElement).value;
      const gameListIsPublic = !(document.getElementById("newGameListIsPrivate") as HTMLInputElement).checked;

      // Check that game list name is populated
      if (gameListName == "") {
        console.log("Game list needs a name!");
        toast.error("Game list needs a name!");
        addListButtonRef.current.removeAttribute("disabled");
        return;
      }

      // Check that game list name is not a duplicate
      let isDuplicate: boolean = false;
      gamelists.forEach((gamelist) => {
        if (gamelist.listname === gameListName) {
          isDuplicate = true;
        }
      });
      if (isDuplicate) {
        console.log("Game list name already exists!");
        toast.error("Game list name already exists!");
        addListButtonRef.current.removeAttribute("disabled");
        return;
      }

      const userAttributes = await fetchUserAttributes();
      const userId = userAttributes.sub as string;

      await createGameList(userId, gameListName, gameListIsPublic, []);

      toast.success("Game list created successfully!");

      addListButtonRef.current.removeAttribute("disabled");
    }
  }

  function handleDeleteGameListButton(e: React.MouseEvent<HTMLButtonElement>) {
    const gameListId = (e.target as HTMLButtonElement).name;

    toast(deletionConfirmationToast, {
      onClose (reason) {
        if (reason === "yes") {
          // Delete all games associated with the list
          deleteGamesByGameListId(gameListId);
          // Then delete the list itself
          deleteGameList(gameListId);

          toast.success("Game list deleted successfully!");
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
      <Authenticator signUpAttributes={["preferred_username"]}>
        <div className="vertical">
          <div id="sectionGameListList" className="vertical">
            <h1>My Game Lists</h1>
            <table>
              <tbody>
                {gamelists.map((gamelists) => (
                  <tr key={gamelists.id}>
                    <td>
                      {gamelists.listname}
                    </td>
                    <td>
                      <Link
                        href={{
                          pathname: "/gamelist",
                          query: { id: gamelists.id },
                        }}
                      >
                        <button>Open</button>
                      </Link>
                    </td>
                    <td>
                      <button name={gamelists.id} onClick={handleDeleteGameListButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button id="buttonAddNewGameList" className="collapsible" onClick={handleAddGameListCollapse}>
              Add New Game List
            </button>
          </div>
          <div id="sectionAddNewGameList" className="collapsible vertical bordered">
            <div className="horizontal">
              <label>Game List Name</label>
              <input id="newGameListName" />
            </div>
            <div className="horizontal">
              <label>Private Game List</label>
              <input type="checkbox" id="newGameListIsPrivate" />
            </div>
            <button ref={addListButtonRef as RefObject<HTMLButtonElement>} onClick={handleCreateGameListButton}>Add Game List</button>
          </div>
        </div>
      </Authenticator>
      <ToastContainer position="bottom-right" theme="dark" />
    </main>
  );
}
