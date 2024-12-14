import { SignIn } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#6f49ceff] to-[#aeb8feff]">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute animate-pulse opacity-20 filter blur-2xl">
          <div className="h-[400px] w-[400px] rounded-full bg-[#6f49ceff] opacity-60 top-10 left-10"></div>
          <div className="h-[300px] w-[300px] rounded-full bg-[#aeb8feff] opacity-60 bottom-20 right-20"></div>
          <div className="h-[500px] w-[500px] rounded-full bg-[#f1555dff] opacity-40 top-1/3 left-1/4"></div>
        </div>
      </div>

      <header className="relative z-10 py-6 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Join Your Favorite Clubs at McGill!
        </h1>
        <p className="mt-4 text-lg text-gray-200 sm:text-xl">
          Discover, connect, and get involved in the vibrant McGill community.
        </p>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center py-16">
        {/* Sign In Section */}
        <div className="animate-fade-in shadow-lg rounded-lg bg-white p-8 max-w-md">
          <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">
            Sign In to Get Started
          </h2>
          <SignIn signUpUrl="/sign-up"/>
        </div>

        {/* Fancy Footer Section */}
        <footer className="mt-12 text-center">
          <p className="text-gray-200">
            &copy; {new Date().getFullYear()} McGill Club Portal. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
