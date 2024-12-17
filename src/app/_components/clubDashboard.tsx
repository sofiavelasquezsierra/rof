// Sofia Velasquez-Sierra
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 md:px-12 py-8 bg-gray-50">
      {/* Dashboard Container */}
      <div className="w-full h-full max-w-6xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Club Dashboard</h2>

        {/* Club Info */}
        {club && (
          <div className="text-center mb-4">
            <h3 className="text-2xl font-semibold">
              Club Name: <span className="text-primary font-bold">{club.clubName}</span>
            </h3>
          </div>
        )}

        {/* Scrollable Table */}
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 overflow-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border text-left whitespace-nowrap">First Name</th>
                <th className="px-4 py-2 border text-left whitespace-nowrap">Last Name</th>
                <th className="px-4 py-2 border text-left whitespace-nowrap">Email</th>
                <th className="px-4 py-2 border text-left whitespace-nowrap">Role</th>
                <th className="px-4 py-2 border text-left whitespace-nowrap">Year</th>
                <th className="px-4 py-2 border text-center whitespace-nowrap">Verification Status</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border">{student.fname}</td>
                  <td className="px-4 py-2 border">{student.lname}</td>
                  <td className="px-4 py-2 border truncate">{student.email}</td>
                  <td className="px-4 py-2 border">{student.role}</td>
                  <td className="px-4 py-2 border">{student.year}</td>
                  <td className="px-4 py-2 border text-center">
                    {student.emailVerified ? (
                      <span className="text-primary font-medium">Verified</span>
                    ) : (
                      <span className="text-secondary font-medium">Pending Verification</span>
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
        </div>

        {/* No Students Message */}
        {students.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No students are currently registered in this club.
          </p>
        )}

        {/* Error Message */}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
