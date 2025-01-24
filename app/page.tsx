"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const { signOut } = useAuthenticator();

  return (
    <main>
      <h1>Too Many Cables</h1>
      <Link href="/profile">Profile</Link>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </main>
  );
}
