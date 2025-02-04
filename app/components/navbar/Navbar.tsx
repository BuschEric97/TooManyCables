"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const navItems = [
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
  },
  {
    id: "mylists",
    label: "My Game Lists",
    href: "/mylists",
  },
]

export default function App() {
  return (
    <nav>
      <Link key="home" href="/">
        <div className="navBarItem">
          Home
        </div>
      </Link>
      {navItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <div className="navBarItem">
              {item.label}
            </div>
          </Link>
      ))}
    </nav>
  );
}
