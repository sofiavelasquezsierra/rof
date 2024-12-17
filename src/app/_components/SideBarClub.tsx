//Saiyid Kazmi
"use client";

import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";

interface Club {
  clubId: string;
  adminEmail: string;
  clubName: string;
}

const SideBarClub: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [hasClub, setHasClub] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      const email = user.emailAddresses[0].emailAddress;

      // Fetch to check if the email has an associated club
      fetch("/api/check-club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setHasClub(data.hasClub || false);
        })
        .catch((err) => console.error("Error checking club association", err));
    }
  }, [user]);

  return (
    <div
      className={`fixed top-16 left-0 h-full bg-gray-800 text-white shadow-lg transition-all duration-300 ${
        expanded ? "w-32" : "w-16"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col h-full p-2">
        <h1
          className={`text-lg font-bold p-4 text-center ${
            expanded ? "block" : "hidden"
          }`}
        >
          Menu
        </h1>
        <ul className="flex flex-col gap-4 mt-4">
          {!hasClub && (
            <li>
              <Link href="/create-club">
                <button className="btn btn-primary w-full" title="Create Club">
                  {expanded ? "Create Club" : "C"}
                </button>
              </Link>
            </li>
          )}
          <li>
            <Link href="/dashboard">
              <button className="btn btn-secondary w-full" title="Dashboard">
                {expanded ? "Dashboard" : "D"}
              </button>
            </Link>
          </li>
          <li>
            <Link href="/analytics">
              <button className="btn btn-neutral w-full" title="Analytics">
                {expanded ? "Analytics" : "A"}
              </button>
            </Link>
          </li>
          <li>
            <Link href="/scheduler">
              <button className="btn btn-info w-full" title="Calendar">
                {expanded ? "Calendar" : "C"}
              </button>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <button
                className="btn btn-accent w-full"
                title="Register Student"
              >
                {expanded ? "Register Student" : "R"}
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarClub;
