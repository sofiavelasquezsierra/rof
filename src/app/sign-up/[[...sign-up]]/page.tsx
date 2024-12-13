import { SignUp } from "@clerk/nextjs";

export default function CustomSignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#6f49ceff] to-[#aeb8feff]">
      <h1 className="text-4xl font-bold text-white mb-6 mt-5">Create Your Account</h1>
      <div className="shadow-lg rounded-lg bg-white p-8 max-w-md mb-10">
        <SignUp />
      </div>
    </div>
  );
}
