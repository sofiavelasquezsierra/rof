"use client";

import React, { useState } from "react";
import OcrUploader from "../_components/OcrUploader"; // Adjust the path based on your folder structure

const Page: React.FC = () => {
  const [studentData, setStudentData] = useState<{
    studentID: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const handleOcrComplete = (data: { studentID: string; firstName: string; lastName: string }) => {
    setStudentData(data);
  };

  const handleSaveToDatabase = async () => {
    if (!studentData) return;

    try {
      const response = await fetch("/api/save-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to save student data.");
      }

      alert("Student data saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save student data. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Student Registration</h1>
      <OcrUploader onOcrComplete={handleOcrComplete} />
      {studentData && (
        <div className="mt-6 p-4 bg-neutral text-primary-content rounded">
          <h2 className="text-lg font-bold">Extracted Information:</h2>
          <p><strong>Student ID:</strong> {studentData.studentID}</p>
          <p><strong>First Name:</strong> {studentData.firstName}</p>
          <p><strong>Last Name:</strong> {studentData.lastName}</p>
          <button className="btn btn-secondary mt-4" onClick={handleSaveToDatabase}>
            Save to Database
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
