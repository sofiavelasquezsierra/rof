import React from "react";
import { ClubDashboard } from "../_components/clubDashboard"; // Ensure the correct import path
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideBarClub from "../_components/SideBarClub";

export default async function DashboardPage() {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    // Redirect user to the login page if not authenticated
    redirect("/sign-in");
  }

  return (
    <div className="flex">
      <SideBarClub />
       <ClubDashboard />
    </div>
  );
}
