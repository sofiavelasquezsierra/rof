import React from "react";
import { CreateClub } from "../_components/CreateClub"; // Ensure the correct import path
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    // Redirect user to the login page or show a message
    redirect("/sign-in"); // Automatically redirects to the sign-in page
  }

  return (
    <div>
      <CreateClub />
    </div>
  );
}
