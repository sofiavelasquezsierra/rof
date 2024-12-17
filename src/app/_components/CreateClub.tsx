"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export function CreateClub(): JSX.Element {
  const { user } = useUser();
  const [clubName, setClubName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createClubMutation = api.clubs.createClub.useMutation();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!user?.emailAddresses[0]?.emailAddress) {
      setError("You must be signed in to create a club.");
      return;
    }

    try {
      await createClubMutation.mutateAsync({
        clubName,
      });

      setMessage("Club created successfully!");
      setClubName(""); // Clear the input field
    } catch (err) {
      console.error("Error creating club:", err);
      setError("Failed to create the club. Please try again. Club could've already been created with this email. Try with a new email.");
    }
  };

  return (
    <div className="flex w-screen flex-col items-center mt-10 min-h-screen px-4 sm:px-16">
    {/* Ensure the form is centered and has fixed max-width */}
    <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="mb-4 text-center text-xl font-bold">
          Create a New Club
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="clubName"
              className="block text-sm font-medium text-gray-700"
            >
              Club Name
            </label>
            <input
              type="text"
              id="clubName"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter club name"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={createClubMutation.status === "pending"}
          >
            {createClubMutation.status === "pending"
              ? "Creating..."
              : "Create Club"}
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
