// Sofia Velasquez-Sierra
"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React, { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

const VerifyStudent: React.FC = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [clubName, setClubName] = useState<string | null>(null);

  const fetchStudentClubMutation = api.students.getStudentClub.useMutation({
    onSuccess: (data) => {
      setClubName(data.clubName);
      setShowModal(true); // Show confirmation modal
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Failed to fetch club. Please try again.");
      setSuccessMessage("");
    },
  });

  const confirmMembershipMutation = api.students.confirmStudentMembership.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      setError("");
      setShowModal(false); // Close the modal on success
    },
    onError: (err) => {
      setError(err.message || "Failed to confirm membership. Please try again.");
    },
  });

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

    fetchStudentClubMutation.mutate({ studentId: userID, email });
  };

  const handleConfirmMembership = () => {
    if (clubName) {
      confirmMembershipMutation.mutate({ studentId: userID, email });
    }
  };

  return (
    <div>
      <SignedIn>
        <div className="mt-10 flex justify-center">
          <button
            className="btn bg-primary px-6 py-3 font-bold text-white hover:bg-secondary"
            onClick={() => setShowModal(true)}
          >
            Admin Popup
          </button>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="mt-10 flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-96 rounded bg-secondary p-8 text-black shadow-lg"
          >
            <h1 className="mb-6 text-center text-2xl font-bold text-white">
              Verify Student
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
            {successMessage && (
              <p className="mb-4 text-green-500">{successMessage}</p>
            )}
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>
          </form>

          {/* Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Confirm Membership</h2>
                <p>
                  You have been registered in{" "}
                  <span className="font-semibold text-primary">{clubName}</span>.
                  Do you agree to join this club?
                </p>
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handleConfirmMembership}
                    className="btn btn-success"
                  >
                    Yes, I Agree
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    No, Cancel
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

export default VerifyStudent;
