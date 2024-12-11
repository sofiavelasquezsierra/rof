import React, { useState } from "react";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    userID: "",
    fname: "",
    lname: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate userID
    if (!/^\d{9}$/.test(formData.userID)) {
      setError("UserID must be exactly 9 numeric digits.");
      return;
    }

    // Validate firstName and lastName (alphanumeric + spaces)
    const namePattern = /^[a-zA-Z0-9\s]+$/;

    if (!namePattern.test(formData.fname)) {
      setError("First Name can only contain letters, numbers, and spaces.");
      return;
    }

    if (!namePattern.test(formData.lname)) {
      setError("Last Name can only contain letters, numbers, and spaces.");
      return;
    }

    // Reset errors and proceed with form submission
    setError(null);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save student data.");
      }

      setSuccess(true);
      setFormData({ userID: "", fname: "", lname: "" });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded bg-base-200 p-6 shadow"
    >
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">UserID (9 digits):</span>
        </label>
        <input
          type="text"
          name="userID"
          value={formData.userID}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
          placeholder="Enter your UserID"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">First Name:</span>
        </label>
        <input
          type="text"
          name="fname" // Update to match the key in formData
          value={formData.fname}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
          placeholder="Enter your First Name"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Last Name:</span>
        </label>
        <input
          type="text"
          name="lname" // Update to match the key in formData
          value={formData.lname}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
          placeholder="Enter your Last Name"
        />
      </div>

      {error && <p className="mb-4 text-error">{error}</p>}
      {success && (
        <p className="mb-4 text-success">Student data saved successfully!</p>
      )}

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  );
};

export default StudentForm;
