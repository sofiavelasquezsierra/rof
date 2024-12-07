'use client'
import Link from 'next/link'
import React from 'react'

const HomeButtons = () => {
  return (
          <div className="flex flex-row items-center justify-center mt-10 space-x-10">
          {/* Club Button */}
          <div className="text-center">
            <Link href="/club">
                <button
                className="btn bg-red-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700"
                onClick={() => console.log("Redirect to Club Page")} // Replace with actual redirect logic
                >
                I’m a Club
                </button>
            </Link>
            <p className="mt-2 text-gray-600">
              As a club, scan student IDs and manage registered students.
            </p>
          </div>
  
          {/* Divider */}
          <div className="h-20 w-[2px] bg-gray-400"></div>
  
          {/* Student Button */}
          <div className="text-center">
            <Link href="/student">
                <button
                className="btn border-2 border-black text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200"
                onClick={() => console.log("Redirect to Student Page")} // Replace with actual redirect logic
                >
                I’m a Student
                </button>
            </Link>
            <p className="mt-2 text-gray-600">
              As a student, verify or manage your club registration.
            </p>
          </div>
        </div>
  )
}

export default HomeButtons