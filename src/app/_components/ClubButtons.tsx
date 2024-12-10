"use client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const ClubButtons = () => {
  return (
    <div className="mt-10 flex flex-row items-center justify-center space-x-10">
      {/* Club Button */}
      <div className="text-center">
        <SignedIn>
          <div className="bg-coral text-white font-bold px-6 py-3 rounded-lg">Click the button to Verify!</div>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <button className="btn btn-primary px-6 py-3 font-bold text-white hover:bg-secondary">
              Sign In
            </button>
          </Link>
        </SignedOut>
        <p className="mt-2 text-gray-600">
          As a club, scan student IDs and manage registered students.
        </p>
      </div>

      {/* Divider */}
      <div className="h-20 w-[2px] bg-gray-400"></div>

      {/* Student Button */}
      <div className="text-center">
        <Link href="/student">
          <button
            className="btn rounded-lg border-2 border-black px-6 py-3 font-bold text-black hover:bg-gray-200"
            onClick={() => console.log("Redirect to Student Page")} // Replace with actual redirect logic
          >
            Verify
          </button>
        </Link>
        <p className="mt-2 text-gray-600">
          As a student, verify or manage your club registration.
        </p>
      </div>
    </div>
  );
};

export default ClubButtons;
