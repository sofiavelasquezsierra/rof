import React from "react";
import RegisterForm from "../_components/RegisterForm";
import SideBarClub from "../_components/SideBarClub";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RegisterStudentPage() {
  
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    // Redirect user to the login page if not authenticated
    redirect("/sign-in");
  }
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBarClub />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ml-16 md:ml-64 p-6`}
      >
        <RegisterForm />
      </main>
    </div>
  );
}
