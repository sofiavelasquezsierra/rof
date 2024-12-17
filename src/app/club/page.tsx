import React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignedOutPopup from "../_components/SignedOutPopup";
import SideBarClub from "../_components/SideBarClub";

const Page = async () => {

  return (
    <div>
      <main className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-4xl font-bold text-primary">Welcome to Rof: The McGill Club Portal</h1>
        <h2 className="text-xl font-medium text-secondary">Use the sidbar on the left to navigate</h2>
        <SignedOut>
          <SignedOutPopup />
        </SignedOut>
        <SignedIn>
          <SideBarClub />
        </SignedIn>
      <img src="/assets/IMG_1255.jpg" alt="Logo" className="h-40"/>
      </main>
    </div>
  );
};

export default Page;
