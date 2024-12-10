import React from "react";
import StudentButtons from "../_components/StudentButtons";

const StudentsPage = () => {
  return (
    <div>
      <div className="flex text-center items-center justify-center pt-10">
        <h1 className="text-4xl font-bold text-primary">Students</h1>
      </div>
      <StudentButtons />
    </div>
  );
};

export default StudentsPage;
