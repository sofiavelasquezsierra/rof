import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { TopNav } from "./_components/TopNav";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Rof",
  description: "McGill Clubs",
  icons: [{ rel: "icon", url: "/logo.jpg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <header>
            <TopNav />
          </header>
          <main>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
