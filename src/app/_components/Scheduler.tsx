"use client";
// Aditya Makijha
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const EventManager = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createEventMutation = api.scheduler.createEvent.useMutation();
  const { data, refetch, isLoading } = api.scheduler.getClubEvents.useQuery();
  const { user } = useUser();
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      // Convert eventDate to ISO 8601 with timezone
      const dateWithTimezone = new Date(eventDate).toISOString();

      await createEventMutation.mutateAsync({
        eventName,
        eventDate: dateWithTimezone,
      });
      setSuccessMessage("Event created successfully!");
      setEventName("");
      setEventDate("");
      refetch(); // Refresh the event list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event.");
    }
  };

  if (!user) {
    // Redirect user to the login page if not authenticated
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h2 className="mb-4 text-2xl font-bold">Manage Club Events</h2>

      <form onSubmit={handleCreateEvent} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Enter event name"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Event Date</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={createEventMutation.status === "pending"}
        >
          {createEventMutation.status === "pending"
            ? "Creating..."
            : "Create Event"}
        </button>
      </form>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Events */}
      <h3 className="mb-4 mt-6 text-center text-xl font-semibold">
        Your Events
      </h3>

      {isLoading ? (
        <p className="text-center">Loading events...</p>
      ) : data?.events.length === 0 ? (
        <p className="text-center text-gray-500">No events created yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Event Name</th>
                <th className="border px-4 py-2 text-left">Event Date</th>
                <th className="border px-4 py-2 text-left">Event Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.events.map((event) => {
                const eventDate = new Date(event.eventDate);
                const date = eventDate.toLocaleDateString();
                const time = eventDate.toLocaleTimeString();

                return (
                  <tr key={event.eventId} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{event.eventName}</td>
                    <td className="border px-4 py-2">{date}</td>
                    <td className="border px-4 py-2">{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventManager;
