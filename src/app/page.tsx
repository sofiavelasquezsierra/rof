import Link from "next/link";
import HomeButtons from "./_components/HomeButtons";


export default function HomePage() {
  return(
    <main className="flex flex-col items-center justify-start min-h-screen pt-10 bg-slate-50">
      <div className="mb-6">
        <img src="/assets/logo.jpg" alt="Logo" className="h-40 w-auto"/>
      </div>

      <h2 className="text-xl font-medium text-secondary">
        Register & Verify Club Members
      </h2>
      <HomeButtons />
    </main>
  )
}