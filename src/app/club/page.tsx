import React from "react";
import { db } from "@/server/db";
import { students } from "~/server/db/schema";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignedOutPopup from "../_components/SignedOutPopup";
import SideBarClub from "../_components/SideBarClub";

interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  year: string;
  role: string;
}

export async function UsersPage() {
  // const students = await db.query.students.findMany();
  // console.log(students);

  return (
    <div>
      <main>
        <SignedOut>
          <SignedOutPopup />
        </SignedOut>
        <SignedIn>
          <SideBarClub />
        </SignedIn>


        {/* {students.map((student) => (
          <ul key={student.id}>
            <li>
              {student.fname}, {student.email}, {student.lname}
            </li>
          </ul>
        ))}
        <h1>Users</h1>
        <p>{new Date().toLocaleTimeString()}</p> */}
      </main>
    </div>
  );
}


export default UsersPage;
