"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

type Student = {
  studentId: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  year: string;
  emailVerified: string | null; // Date or null
};

export function ClubDashboard(): JSX.Element {
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const { data, isLoading, isError, refetch } = api.dashboard.clubDashboard.useQuery();

  // Delete Student Mutation
  const deleteStudentMutation = api.dashboard.deleteStudent.useMutation({
    onSuccess: () => {
      refetch(); // Refresh data after deletion
      setError(null);
    },
    onError: (err) => {
      setError(err.message || "Failed to delete student.");
    },
  });

  // Handle Deleting a Student
  const handleDeleteStudent = (studentId: string, clubId: string) => {
    const confirmDelete = confirm("Are you sure you want to remove this student?");
    if (confirmDelete) {
      deleteStudentMutation.mutate({ studentId, clubId });
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-red-500">Please sign in to view the dashboard.</p>;
  }

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (isError || !data) {
    return <p className="text-center mt-10 text-red-500">Failed to load dashboard data.</p>;
  }

  const { club, students } = data;

  return (
<<<<<<< HEAD
    <div className="flex w-screen flex-col items-center justify-center min-h-screen px-4 sm:px-16">
    {/* Dashboard Card */}
    <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 md:p-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Club Dashboard
      </h2>

      {club && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold">
            Club Name:{" "}
            <span className="text-primary font-bold">{club.clubName}</span>
          </h3>
=======
    <div className="flex w-screen flex-col items-center justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Club Dashboard</h2>
        {club && (
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold">
              Club Name: <span className="text-primary">{club.clubName}</span>
            </h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border text-left">First Name</th>
                <th className="px-4 py-2 border text-left">Last Name</th>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-left">Role</th>
                <th className="px-4 py-2 border text-left">Year</th>
                <th className="px-4 py-2 border text-center">Verification Status</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.studentId}
                  className={`hover:bg-gray-100 ${
                    !student.emailVerified ? "" : ""
                  }`}
                >
                  <td className="px-4 py-2 border">{student.fname}</td>
                  <td className="px-4 py-2 border">{student.lname}</td>
                  <td className="px-4 py-2 border">{student.email}</td>
                  <td className="px-4 py-2 border">{student.role}</td>
                  <td className="px-4 py-2 border">{student.year}</td>
                  <td className="px-4 py-2 border text-center">
                    {student.emailVerified ? (
                      <span className="text-primary ">Verified</span>
                    ) : (
                      <span className="text-secondary  ">
                        Pending Verification
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDeleteStudent(student.studentId, club.clubId)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
>>>>>>> 1a5fb947ef4d195f955d9527c016394f8dbfe994
        </div>
      )}

      {/* Scrollable Table for Smaller Screens */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border text-left whitespace-nowrap">First Name</th>
              <th className="px-4 py-2 border text-left whitespace-nowrap">Last Name</th>
              <th className="px-4 py-2 border text-left whitespace-nowrap">Email</th>
              <th className="px-4 py-2 border text-left whitespace-nowrap">Role</th>
              <th className="px-4 py-2 border text-left whitespace-nowrap">Year</th>
              <th className="px-4 py-2 border text-center whitespace-nowrap">Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.studentId}
                className="hover:bg-gray-100 transition-all"
              >
                <td className="px-4 py-2 border">{student.fname}</td>
                <td className="px-4 py-2 border">{student.lname}</td>
                <td className="px-4 py-2 border truncate">{student.email}</td>
                <td className="px-4 py-2 border">{student.role}</td>
                <td className="px-4 py-2 border">{student.year}</td>
                <td className="px-4 py-2 border text-center">
                  {student.emailVerified ? (
                    <span className="text-primary font-medium">Verified</span>
                  ) : (
                    <span className="text-secondary font-medium">
                      Pending Verification
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Students Message */}
      {students.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No students are currently registered in this club.
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}
    </div>
  </div>
  );
}
