"use client";
// Aditya Makijha
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export function UserClubAnalytics(): JSX.Element {
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);

  const {
    data: aggregatedAnalyticsData,
    error: aggregatedFetchError,
    isLoading: isAggregatedLoading,
  } = api.analytics.getAggregatedAnalytics.useQuery(undefined, {
    enabled: !!user, 
  });

  if (aggregatedFetchError && !error) {
    setError(aggregatedFetchError.message || "Failed to fetch aggregated analytics.");
  }

  return (
    <div className="flex w-screen flex-col items-center mt-10 min-h-screen px-4 sm:px-16">
      <h2 className="mb-4 text-center text-xl font-bold">Club Analytics</h2>
      {isAggregatedLoading ? <p>Loading...</p> : null}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {/* Display aggregated analytics with club stats */}
      {aggregatedAnalyticsData ? (
        <div className="mt-6 w-full max-w-lg rounded bg-gray-100 p-6 bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white overflow-x-auto overflow-y-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Club Name</th>
                <th className="py-2 px-4 border-b">Total Students</th>
                <th className="py-2 px-4 border-b">Year</th>
                <th className="py-2 px-4 border-b">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-bold text-primary">{aggregatedAnalyticsData.club.clubName}</td>
                <td className="py-2 px-4 border-b">{aggregatedAnalyticsData.totalStudents}</td>
                <td className="py-2 px-4 border-b" colSpan={2}>
                  <table className="min-w-full bg-white">
                    <tbody>
                      {Object.entries(aggregatedAnalyticsData.yearCounts).map(([year, count]) => (
                        <tr key={year}>
                          <td className="py-2 px-4 border-b">{year}</td>
                          <td className="py-2 px-4 border-b">{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>No aggregated analytics available.</p>
      )}
    </div>
  );
}
