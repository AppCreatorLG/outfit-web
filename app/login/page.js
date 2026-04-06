"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        ClosetLogic
      </h1>

      <button
        onClick={() =>
          signIn("google", {
            redirect: true,
            callbackUrl: "/dashboard",
          })
        }
        className="bg-black text-white py-2 px-4 rounded"
      >
        Continue with Google
      </button>
    </div>
  );
}