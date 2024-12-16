"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export function ClubDashboard(): JSX.Element {
    const { user } = useUser();
    const [error, setError] = useState<string | null>(null);

    // Fetch club dashboard data
  const { data, isLoading, isError } = api.dashboard.clubDashboard.useQuery();

  useEffect(() => {
    if (!user) {
      setError("You must be signed in to view the dashboard.");
    }
  }, [user]);

  if (isLoading) {
    return <p className="h-screen flex items-center justify-center">Loading...</p>;
  }

  if (isError || !data) {
    return (
      <div className="w-screen flex items-center justify-center">
    <p className="text-center text-red-500">Failed to fetch dashboard data. Please try again.</p>
    </div>
  );
  }

  const { club, students } = data;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-8 rounded bg-white shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Club Dashboard</h2>
        {club && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold">
              Club Name: <span className="text-indigo-600">{club.clubName}</span>
            </h3>
          </div>
        )}
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Year</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: { studentId: React.Key | null | undefined; fname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; lname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; role: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; year: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
              <tr key={student.studentId} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{student.fname}</td>
                <td className="border border-gray-300 px-4 py-2">{student.lname}</td>
                <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                <td className="border border-gray-300 px-4 py-2">{student.role}</td>
                <td className="border border-gray-300 px-4 py-2">{student.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students are currently registered in this club.</p>
        )}
      </div>
    </div>
  );
}