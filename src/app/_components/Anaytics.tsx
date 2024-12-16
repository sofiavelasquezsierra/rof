"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export function UserClubAnalytics(): JSX.Element {
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);

  // Use the TRPC query hook for user-specific club analytics
  const { data: userAnalyticsData, error: userFetchError, isLoading: isUserLoading } =
    api.analytics.getUserClubAnalytics.useQuery(undefined, {
      enabled: !!user, // Only fetch if the user is authenticated
    });

  // Use the TRPC query hook for aggregated analytics (club stats with student count)
  const { data: aggregatedAnalyticsData, error: aggregatedFetchError, isLoading: isAggregatedLoading } =
    api.analytics.getAggregatedAnalytics.useQuery(undefined, {
      enabled: !!user, // Only fetch if the user is authenticated
    });

  // Handle errors from TRPC
  if (userFetchError && !error) {
    setError(userFetchError.message || "Failed to fetch user analytics.");
  }
  if (aggregatedFetchError && !error) {
    setError(aggregatedFetchError.message || "Failed to fetch aggregated analytics.");
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h2 className="mb-4 text-center text-xl font-bold">User Club Analytics</h2>

      {isUserLoading || isAggregatedLoading ? <p>Loading...</p> : null}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Display user-specific clubs data */}
      {userAnalyticsData && (
        <div className="mt-6 w-full max-w-lg rounded bg-gray-100 p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Your Clubs:</h3>
          {userAnalyticsData.clubData.length > 0 ? (
            <ul className="list-disc pl-6">
              {userAnalyticsData.clubData.map((club: any) => (
                <li key={club.clubId} className="mb-2">
                  <span className="font-bold">Name:</span> {club.clubName}
                </li>
              ))}
            </ul>
          ) : (
            <p>No clubs found for your account.</p>
          )}
        </div>
      )}

      {/* Display aggregated analytics with club stats */}
      {aggregatedAnalyticsData && (
        <div className="mt-6 w-full max-w-lg rounded bg-gray-100 p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Aggregated Club Analytics:</h3>
          {aggregatedAnalyticsData.stats.length > 0 ? (
            <ul className="list-disc pl-6">
              {aggregatedAnalyticsData.stats.map((stat: any) => (
                <li key={stat.clubId} className="mb-2">
                  <span className="font-bold">Club Name:</span> {stat.clubName} <br />
                  <span className="font-bold">Admin Email:</span> {stat.adminEmail} <br />
                  <span className="font-bold">Student Count:</span> {stat.studentCount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No aggregated analytics available.</p>
          )}
        </div>
      )}
    </div>
  );
}
