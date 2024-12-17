import React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignedOutPopup from "../_components/SignedOutPopup";
import SideBarClub from "../_components/SideBarClub";

const Page = async () => {
  // Replace this with your database call if needed
  // const students = await db.query.students.findMany();

  return (
    <div>
      <main>
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

        <h1 className="text-center mt-6 text-2xl font-bold">Users Page</h1>
        <p className="text-center">{new Date().toLocaleTimeString()}</p>
      </main>
    </div>
  );
};

export default Page;
