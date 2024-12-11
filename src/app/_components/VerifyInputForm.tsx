"use client";

import React, { useState } from "react";

const InputForm: React.FC = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [clubs, setClubs] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

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

    // Uncomment and integrate API call for fetching registered clubs
    /*
    fetch("/api/get-clubs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setClubs(data.clubs || []);
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Error fetching clubs:", err);
        setError("Failed to fetch registered clubs. Please try again later.");
      });
    */
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary text-black p-8 rounded shadow-lg w-96"
      >
        <h1 className="text-white text-2xl font-bold text-center mb-6">User Form</h1>
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
        {error && <p className="text-error mb-4">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          Submit
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Registered Clubs</h2>
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
  );
};

export default InputForm;
