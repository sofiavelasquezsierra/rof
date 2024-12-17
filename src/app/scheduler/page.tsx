import React, { useState } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideBar from "../_components/SideBar"; // A sidebar component, if needed
import Scheduler from "../_components/Scheduler"; // Scheduler component

export default async function SchedulerPage() {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    redirect("/sign-in"); // Redirect if user is not authenticated
  }

  return (
    <div className="container">
      <SideBar />
      <div className="main-content">
        <h1>Scheduler</h1>
        <Scheduler />
      </div>
    </div>
  );
}
