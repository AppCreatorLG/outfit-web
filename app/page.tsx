"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "firebase/auth";

export default function Landing() {

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard";
    }
  };

  useEffect(() => {
    const checkRedirect = async () => {
      const result = await getRedirectResult(auth);
      if (result) {
        window.location.href = "/dashboard";
      }
    };

    checkRedirect();

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/dashboard";
      }
    });

    return () => unsub();
  }, []);

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
        onClick={handleGoogleLogin}
        className="w-full bg-white p-4 rounded-2xl shadow-md font-medium active:scale-95 transition"
      >
        Continue with Google
      </button>

    </div>
  );
}