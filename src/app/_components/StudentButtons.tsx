"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

const StudentButtons = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);

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
        <div className="text-center">
          <button
            className="btn bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-700"
            onClick={() => setShowAdminModal(true)}
          >
            Admin Notice
          </button>

          {/* Admin Modal */}
          {showAdminModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
                  Admin Notice
                </h2>
                <p className="mb-6 text-center text-gray-600">
                  Only club admins should be signed-in. Please sign out using the top right corner if you are a student.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowAdminModal(false)}
                    className="btn bg-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
};

export default StudentButtons;
