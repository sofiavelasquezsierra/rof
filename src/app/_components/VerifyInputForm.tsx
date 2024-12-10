"use client";

import React, { useState } from "react";

const InputForm: React.FC = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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

    alert(`UserID: ${userID}, Email: ${email}`);
    setUserID("");
    setEmail("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary text-primary-content p-8 rounded shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">User Form</h1>
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
    </div>
  );
};

export default InputForm;
