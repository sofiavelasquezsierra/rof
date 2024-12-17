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


  if (!user) {
    return <p className="text-center w-screen mt-10 text-red-500">Please sign in to view the dashboard.</p>;
  }

  if (isLoading) {
    return <p className="text-center w-screen mt-10">Loading...</p>;
  }

  if (isError || !data) {
    return <p className="text-center mt-10 w-screen text-red-500">Failed to load dashboard data.</p>;
  }

  const { club, students } = data;

  return (
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
                
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.studentId}
                  className={`hover:bg-gray-100 ${
                    !student.emailVerified ?  " " : ""
                  }`}
                >
                  <td className="px-4 py-2 border">{student.fname}</td>
                  <td className="px-4 py-2 border">{student.lname}</td>
                  <td className="px-4 py-2 border">{student.email}</td>
                  <td className="px-4 py-2 border">{student.role}</td>
                  <td className="px-4 py-2 border">{student.year}</td>
                  <td className="px-4 py-2 border text-center">
                    {student.emailVerified ? (
                      <span className="text-primary">Verified</span>
                    ) : (
                      <span className="text-secondary">
                        Pending Verification
                      </span>
                    )}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No students are currently registered in this club.
          </p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
