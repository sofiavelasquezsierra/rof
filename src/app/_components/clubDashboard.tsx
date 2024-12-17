"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

type Student = {
  studentId: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  year: string;
};

export function ClubDashboard(): JSX.Element {
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: "asc" | "desc" } | null>(null);

  // Fetch club dashboard data
  const { data, isLoading, isError, refetch } = api.dashboard.clubDashboard.useQuery();

  // Delete student mutation
  const deleteStudentMutation = api.dashboard.deleteStudent.useMutation({
    onSuccess: () => {
      refetch(); // Refetch the data after successful deletion
    },
    onError: (error) => {
      setError(error.message || "Failed to delete student. Please try again.");
    },
  });

  const handleDelete = (studentId: string, clubId: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudentMutation.mutate({ studentId, clubId });
    }
  };

  const sortTable = (key: keyof Student) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...(data?.students || [])].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    data!.students = sorted;
  };

  if (!user) {
    return <p className="text-center w-screen mt-10 text-red-500">Please sign in to view the dashboard.</p>;
  }

  if (isLoading) {
    return <p className="text-center w-screen mt-10">Loading...</p>;
  }

  if (isError || !data) {
    return <p className="text-center w-screen mt-10 text-red-500">Failed to load dashboard data.</p>;
  }

  const { club, students } = data;

  return (
    <div className="flex flex-col w-screen items-center justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Club Dashboard</h2>
        {club && (
          <div className="text-center mb-4">
            <p className="text-xl">
              <strong>Club Name:</strong> <span className="text-primary">{club.clubName}</span>
            </p>
          </div>
        )}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th
                onClick={() => sortTable("fname")}
                className="cursor-pointer px-4 py-2 border border-gray-300 text-left"
              >
                First Name {sortConfig?.key === "fname" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => sortTable("lname")}
                className="cursor-pointer px-4 py-2 border border-gray-300 text-left"
              >
                Last Name {sortConfig?.key === "lname" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">Email</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Role</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Year</th>
              <th className="px-4 py-2 border border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId} className="hover:bg-info hover:bg-opacity-15">
                <td className="px-4 py-2 border border-gray-300">{student.fname}</td>
                <td className="px-4 py-2 border border-gray-300">{student.lname}</td>
                <td className="px-4 py-2 border border-gray-300">{student.email}</td>
                <td className="px-4 py-2 border border-gray-300">{student.role}</td>
                <td className="px-4 py-2 border border-gray-300">{student.year}</td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <button
                    onClick={() => handleDelete(student.studentId, club.clubId)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students are currently registered in this club.</p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
