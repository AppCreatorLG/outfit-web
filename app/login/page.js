"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";

export default function LoginPage() {

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Google sign-in failed");
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/dashboard";
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center px-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        ClosetLogic
      </h1>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-white p-4 rounded-2xl shadow-md"
      >
        Continue with Google
      </button>

    </div>
  );
}