"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React, { useState } from "react";
import Link from "next/link";

const InputForm: React.FC = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [clubs, setClubs] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleUserIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUserID(value);
      setError("");
    } else {
      setError("UserID must contain only numbers.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userID) {
      setError("UserID is required.");
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("A valid email is required.");
      return;
    }

    // Mock data for clubs; replace with actual fetch from API
    const registeredClubs = ["Art Club", "Music Club", "Coding Club"];
    setClubs(registeredClubs);
    setShowModal(true);
  };

  return (
    <div>
      <SignedIn>
        <div className="mt-10 flex justify-center">
          <button
            className="btn bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-700"
            onClick={() => setShowAdminModal(true)}
          >
            Admin Popup
          </button>
        </div>

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
                Admin Notice
              </h2>
              <p className="mb-6 text-center text-gray-600">
                If you're signed in, you should be only acting as a club admin.
                Please sign out using the top right corner if you're a student.
                If you're a club admin, click the button below!
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/club">
                  <button
                    className="btn bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-700"
                    onClick={() => {
                      setShowAdminModal(false);
                      console.log("Redirect to Club Page"); // Replace with actual redirect logic
                    }}
                  >
                    I’m a Club
                  </button>
                </Link>
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
      </SignedIn>
      <SignedOut>
        <div className="mt-10 flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-96 rounded bg-secondary p-8 text-black shadow-lg"
          >
            <h1 className="mb-6 text-center text-2xl font-bold text-white">
              User Form
            </h1>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">UserID (Numbers Only)</span>
              </label>
              <input
                type="text"
                value={userID}
                onChange={handleUserIDChange}
                className="input input-bordered w-full"
                placeholder="Enter UserID"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="input input-bordered w-full"
                placeholder="Enter Email"
              />
            </div>
            {error && <p className="mb-4 text-error">{error}</p>}
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>
          </form>

          {/* Clubs Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Registered Clubs</h2>
                {clubs.length > 0 ? (
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Club Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs.map((club, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{club}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No clubs found.</p>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedOut>
    </div>
  );
};

export default InputForm;
