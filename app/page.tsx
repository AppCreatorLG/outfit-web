"use client";

import { signIn } from "next-auth/react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col justify-center px-6">

      {/* APP NAME */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Closet AI</h1>
        <p className="text-gray-500 mt-2">
          Your personal stylist
        </p>
      </div>

      {/* LOGIN BUTTON */}
      <button
        onClick={() =>
          signIn("google", {
            redirect: true,
            callbackUrl: "/dashboard",
          })
        }
        className="w-full bg-white p-4 rounded-2xl shadow-md font-medium active:scale-95 transition"
      >
        Continue with Google
      </button>

    </div>
  );
}