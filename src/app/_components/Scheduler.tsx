"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Scheduler } from "timers/promises";
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
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Club Events</h2>

      <form onSubmit={handleCreateEvent} className="space-y-4 mb-6">
        <div>
          <label className="block font-medium">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={createEventMutation.status === "pending"}
        >
          {createEventMutation.status === "pending" ? "Creating..." : "Create Event"}
        </button>
      </form>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Events */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Your Events</h3>
      {isLoading ? (
        <p>Loading events...</p>
      ) : (
        <ul className="space-y-2">
          {data?.events.map((event) => (
            <li
              key={event.eventId}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{event.eventName}</p>
                <p className="text-gray-500">{new Date(event.eventDate).toLocaleString()}</p>
              </div>
            </li>
          ))}
          {data?.events.length === 0 && <p>No events created yet.</p>}
        </ul>
      )}
    </div>
  );
};

export default EventManager;
