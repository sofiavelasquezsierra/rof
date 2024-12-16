import React from "react";
import RegisterForm from "../_components/RegisterForm";
import SideBarClub from "../_components/SideBarClub";

const RegisterStudentPage = () => {
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
};

export default RegisterStudentPage;
