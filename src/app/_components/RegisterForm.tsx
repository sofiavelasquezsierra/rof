"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    studentId: "",
    year: "",
    role: "",
    email: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createStudentMutation = api.students.registerStudent.useMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // If studentId, ensure it contains only 9 digits
    if (name === "studentId" && !/^\d{0,9}$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{9}$/.test(formData.studentId)) {
      setError("Student ID must contain exactly 9 digits.");
      return;
    }

    if (formData.role === "") {
      setError("Please select a role.");
      return;
    }

    try {
      await createStudentMutation.mutateAsync(formData);
      setMessage("Student registered successfully!");
      setFormData({
        fname: "",
        lname: "",
        studentId: "",
        year: "",
        role: "",
        email: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="flex w-screen flex-col items-center justify-center min-h-screen px-4 sm:px-16">
    {/* Ensure the form is centered and has fixed max-width */}
    <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Register a New Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fname"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lname"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lname"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="example@email.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700"
            >
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="9-digit Student ID"
              required
            />
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            >
              <option value="U0">U0</option>
              <option value="U1">U1</option>
              <option value="U2">U2</option>
              <option value="U3">U3</option>
              <option value="U3+">U3+</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-secondary"
              required
              >
              <option value="Student">Student</option>
              <option value="Executive">Executive</option>
              </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={createStudentMutation.status === "pending"}
          >
            {createStudentMutation.status === "pending" ? "Registering..." : "Register"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center font-medium text-green-600">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-center font-medium text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;