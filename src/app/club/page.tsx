import React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignedOutPopup from "../_components/SignedOutPopup";
import SideBarClub from "../_components/SideBarClub";

const Page = async () => {
  // Replace this with your database call if needed
  // const students = await db.query.students.findMany();

  return (
    <div>
      <main className="flex flex-col items-center justify-start pt-10">
        <SignedOut>
          <SignedOutPopup />
        </SignedOut>
        <SignedIn>
          <SideBarClub />
        </SignedIn>

        {/* Example Static Content */}
        {/* Uncomment and use this when fetching students */}
        {/* {students.map((student) => (
          <ul key={student.id}>
            <li>
              {student.fname}, {student.email}, {student.lname}
            </li>
          </ul>
        ))} */}

      <img src="/assets/IMG_1255.jpg" alt="Logo" className="h-40"/>
      </main>
    </div>
  );
};

export default Page;
