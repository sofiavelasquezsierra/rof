import React from "react";
import { UserClubAnalytics } from "../_components/Anaytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideBarClub from "../_components/SideBarClub";

export default async function CreateAnalytics() {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    // Redirect user to the login page or show a message
    redirect("/sign-in"); // Automatically redirects to the sign-in page
  }

  return (
    <div>
      <SideBarClub />
      <UserClubAnalytics />
    </div>
  );
}
