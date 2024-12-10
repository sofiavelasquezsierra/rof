"use client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const StudentButtons = () => {
  return (
    <div className="mt-10 flex flex-row items-center justify-center space-x-10">
      {/* Club Button */}
      <SignedOut>
        <div className="text-center">
          <SignInButton>
            <button className="btn btn-neutral">Sign In</button>
          </SignInButton>

          <p className="mt-2 text-gray-600">
            As a club, scan student IDs and manage registered students.
          </p>
        </div>
      </SignedOut>

      {/* Student Button */}
      <SignedIn>
        <div className="text-center">
          <Link href="/student/verify">
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
      </SignedIn>
    </div>
  );
};

export default StudentButtons;
