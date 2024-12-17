"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

export function EventScheduler(): JSX.Element {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState([]);

  // TRPC Mutations
  const createEventMutation = api.scheduler.createEvent.useMutation();
  const getClubEventsQuery = api.scheduler.getClubEvents.useQuery(undefined, {
    enabled: false, // Initially disable auto-fetching
  });

  // Handle form submission
  const handleCreateEvent = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await createEventMutation.mutateAsync({
        eventName,
        eventDate,
        description,
      });

      setMessage("Event created successfully!");
      setEventName("");
      setEventDate("");
      setDescription("");
      fetchEvents(); // Refresh events after creating one
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(err.message || "Failed to create event. Please try again.");
    }
  };

  // Fetch events
  const fetchEvents = async (): Promise<void> => {
    try {
      const data = await getClubEventsQuery.refetch();
      setEvents(data.data?.events || []);
    } catch (err: any) {
      console.error}}
    }
