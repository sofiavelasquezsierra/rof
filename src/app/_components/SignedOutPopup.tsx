//Saiyid Kazmi
"use client";

import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SignInPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      {/* Signed-Out Logic */}
      <SignedOut>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal modal-open">
              <div className="modal-box text-center">
                <h2 className="text-2xl font-bold mb-4">Access Clubs Page</h2>
                <p className="mb-6 text-gray-600">
                  To access the Clubs page, please sign in.
                </p>
                <SignInButton mode="modal">
                  <button className="btn btn-primary w-full">
                    Sign In
                  </button>
                </SignInButton>
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
      </SignedOut>
    </>
  );
};

export default SignInPopup;
