"use client";

import Link from "next/link";
import "./../../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const navItems = [
  {
    id: "home",
    label: "Home",
    href: "/",
  },
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
