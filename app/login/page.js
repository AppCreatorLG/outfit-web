"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl mb-6">Sign in</h1>

      <button
        onClick={() =>
          signIn("google", {
            redirect: true,
            callbackUrl: "/dashboard",
          })
        }
        className="bg-black text-white px-4 py-2 rounded"
      >
        Continue with Google
      </button>
    </div>
  );
}