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
    const [sortedStudents, setSortedStudents] = useState<Student[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: "asc" | "desc" } | null>(null);


    // Fetch club dashboard data
  const { data, isLoading, isError } = api.dashboard.clubDashboard.useQuery();

  useEffect(() => {
    if (!user) {
      setError("You must be signed in to view the dashboard.");
    }
  }, [user]);

  useEffect(() => {
    if (data?.students) {
      setSortedStudents(data.students);
    }
  }, [data]);

  // Sort handler
  const sortTable = (key: keyof Student) => {
    let direction: "asc" | "desc" = "asc";

    // Determine sort direction
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...data!.students].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedStudents(sorted);
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="w-screen flex items-center justify-center">
        <p className="text-xl font-medium">Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Failed to fetch dashboard data. Please try again.</p>
      </div>
    );
  }

  const { club } = data;

  return (
    <div className="flex w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-8 rounded-lg bg-white shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Club Dashboard</h2>
        {club && (
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold">
              Club Name: <span className="text-indigo-600">{club.clubName}</span>
            </h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th
                  onClick={() => sortTable("fname")}
                  className="cursor-pointer border border-gray-300 px-4 py-2 text-left"
                >
                  First Name {sortConfig?.key === "fname" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => sortTable("lname")}
                  className="cursor-pointer border border-gray-300 px-4 py-2 text-left"
                >
                  Last Name {sortConfig?.key === "lname" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => sortTable("email")}
                  className="cursor-pointer border border-gray-300 px-4 py-2 text-left"
                >
                  Email {sortConfig?.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => sortTable("role")}
                  className="cursor-pointer border border-gray-300 px-4 py-2 text-left"
                >
                  Role {sortConfig?.key === "role" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => sortTable("year")}
                  className="cursor-pointer border border-gray-300 px-4 py-2 text-left"
                >
                  Year {sortConfig?.key === "year" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-100 text-center">
                  <td className="border border-gray-300 px-4 py-2">{student.fname}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.lname}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.role}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students are currently registered in this club.</p>
        )}
      </div>
    </div>
  );
}
