"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import {
  fetchUserAttributes,
  updateUserAttribute,
} from "@aws-amplify/auth";
import { useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContainer, toast } from "react-toastify";
import "./../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  async function getUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();

      const username = userAttributes.preferred_username as string;
      const email = userAttributes.email as string;
      (document.getElementById("username") as HTMLInputElement).value = username;
      (document.getElementById("email") as HTMLInputElement).value = email;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserAttributes();
  }, []);

  function handleSavePreferredUsername() {
    const newUsername = (document.getElementById("username") as HTMLInputElement).value;
    savePreferredUsername(newUsername);
  }

  async function savePreferredUsername(newUsername: string) {
    try {
      await updateUserAttribute({
        userAttribute: {
          attributeKey: "preferred_username",
          value: newUsername,
        }
      });
      console.log("Username updated successfully!");
      toast.success("Username updated successfully!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <Authenticator signUpAttributes={["preferred_username"]}>
        {({ signOut }) => (
          <div>
            <h1>TMC User Profile</h1>
            <table>
              <tbody>
                <tr>
                  <td align="right">
                    <label>Username</label>
                  </td>
                  <td align="left">
                    <input id="username" />
                  </td>
                  <td>
                    <button onClick={handleSavePreferredUsername}>Save</button>
                  </td>
                </tr>
                <tr>
                  <td align="right">
                    <label>Email</label>
                  </td>
                  <td align="left">
                    <input id="email" readOnly />
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )}
      </Authenticator>
      <ToastContainer position="bottom-right" theme="dark" />
    </main>
  );
}