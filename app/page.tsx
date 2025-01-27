"use client";

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
  return (
    <main>
      <h1>Welcome to TMC!</h1>
      <Link href="/mylists"><button>My Game Lists</button></Link>
      <Link href="/profile"><button>Profile</button></Link>
    </main>
  );
}
