"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
export function TopNav() {
  return (
    <div className="navbar bg-secondary">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          Rof
        </Link>
      </div>
      <div className="navbar-end">
        <div className="btn btn-primary">
          <SignedOut>
            <SignInButton>
              Sign In
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
