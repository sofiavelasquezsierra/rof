"use client";

import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

type Event = {
  id: string;
  clubName: string;
  title: string;
  date: string;
  description: string;
  budget: number;
};

export default function CreateEventForm(): JSX.Element {
  const [clubName, setClubName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]); // Events table state
  const [message, setMessage] = useState<string | null>(null);

  const getUserClub = api.scheduler.getUserClub.useQuery();

  useEffect(() => {
    if (getUserClub.data?.clubName) {
      setClubName(getUserClub.data.clubName);
      setDate(new Date().toISOString()); // Set today's date
    }
  }, [getUserClub.data]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const newEvent: Event = {
      id: crypto.randomUUID(), // Generate a unique ID
      clubName,
      title,
      date,
      description,
      budget,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]); // Add to events
    setMessage(`Event "${title}" created successfully!`);

    // Reset form
    setTitle("");
    setDate(new Date().toISOString());
    setDescription("");
    setBudget(0);
  };

  // Handle delete event
  const handleDelete = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6">
      {/* Event Form */}
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg mb-8">
        <h2 className="mb-6 text-2xl font-bold text-center">Create a New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Club Name</label>
            <input
              type="text"
              value={clubName}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter event title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter event budget"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
              placeholder="Enter event description"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn w-full btn-primary hover:btn-secondary"
          >
            Create Event
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </div>

      {/* Event Table */}
      <div className="w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-center mb-4">Created Events</h3>
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Club Name</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Budget</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{event.clubName}</td>
                    <td className="px-4 py-2 border">{event.title}</td>
                    <td className="px-4 py-2 border">{event.date}</td>
                    <td className="px-4 py-2 border">${event.budget}</td>
                    <td className="px-4 py-2 border">{event.description}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No events created yet.</p>
        )}
      </div>
    </div>
  );
}
