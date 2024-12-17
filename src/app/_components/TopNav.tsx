"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
export function TopNav() {
  return (
    <div className="navbar bg-secondary">
      <div className="navbar-start">
      <Link href="/" className="btn btn-ghost p-0">
          <img
            src="/assets/logo.jpg"
            alt="Rof Logo"
            className="h-10 w-auto object-contain hover:animate-spin"
          />
        </Link>
      </div>
      <div className="navbar-end">
        <div className="flex gap-2">
          <SignedOut>
            <Link href="/sign-in">
              <button className="btn btn-primary text-l">Sign In</button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
