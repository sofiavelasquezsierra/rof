"use client";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

const StudentButtons = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="mt-10 flex flex-row items-center justify-center space-x-10">
      {/* Club Button */}
      <SignedOut>
        <div className="text-center">
          <Link href="/verify">
            <button
              className="btn rounded-lg border-2 border-black px-6 py-3 font-bold text-black hover:bg-gray-200"
              onClick={() => console.log("Redirect to verification page")} // Replace with actual redirect logic
            >
              Verify
            </button>
          </Link>

          <p className="mt-2 text-gray-600">
            As a student, verify your membership using your student ID and email.
          </p>
        </div>
      </SignedOut>

      {/* Student Button */}
      <SignedIn>
      {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal modal-open">
              <div className="modal-box text-center">
                <h2 className="text-2xl font-bold mb-4">Sign Out & Verify</h2>
                <p className="mb-6 text-gray-600">
                  To access the student verification page, please sign out.
                </p>
                <SignOutButton redirectUrl="/verify">
                  <button className="btn btn-primary w-full">
                    Sign Out and Verify
                  </button>
                </SignOutButton>
                <button
                  onClick={() => setShowPopup(false)}
                  className="btn btn-secondary w-full mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </SignedIn>
    </div>
  );
};

export default StudentButtons;
