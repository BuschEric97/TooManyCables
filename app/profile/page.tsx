"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import {
  fetchUserAttributes,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
  type UpdateUserAttributeInput,
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
  let username: string;
  let email: string;

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log(userAttributes);

      username = userAttributes.preferred_username as string;
      email = userAttributes.email as string;
      (document.getElementById("username") as HTMLInputElement).value = username;
      (document.getElementById("email") as HTMLInputElement).value = email;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleFetchUserAttributes();
  }, []);

  function handlePreferredUsernameOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    username = e.target.value;
  }

  async function handleSavePreferredUsername() {
    try {
      const attributeKey = "preferred_username";
      const value = username;
      const output = await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value
        }
      });
      console.log("Username updated successfully!");
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
                  <td align="right">Preferred Username </td>
                  <td align="left">
                    <input id="username" value={username} onChange={handlePreferredUsernameOnChange} />
                  </td>
                  <td>
                    <button onClick={handleSavePreferredUsername}>Save</button>
                  </td>
                </tr>
                <tr>
                  <td align="right">Email </td>
                  <td align="left">
                    <input id="email" readOnly value={email} />
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )}
      </Authenticator>
      <Link href="/"><button>Home</button></Link>
    </main>
  );
}