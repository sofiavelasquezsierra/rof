import React from "react";
import StudentButtons from "../_components/StudentButtons";

const StudentsPage = () => {
  return (
    <div>
      <div className="flex flex-col text-center items-center justify-center pt-10 space-y-4">
        <h1 className="text-4xl font-bold text-primary">Students</h1>
        <h2 className="text-xl font-medium text-secondary">
          After you&apos;ve registered with a club, you can verify your membership!
        </h2>
      </div>
      <StudentButtons />
    </div>
  );
};

export default StudentsPage;
