import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Link from "next/link";
import "./app.css";
import Navbar from "./components/navbar/Navbar"
import "@aws-amplify/ui-react/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Too Many Cables",
  description: "A place to catalogue and tackle your backlog of video games!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          <Navbar />
          {children}
        </Suspense>
      </body>
    </html>
  );
}
