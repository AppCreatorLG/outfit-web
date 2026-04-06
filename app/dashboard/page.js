"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("Styled for today ✨");
  const [weatherIcon, setWeatherIcon] = useState("🌤");
  const [todayOutfit, setTodayOutfit] = useState(null);

  // 🔐 AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/";
    });
    return () => unsub();
  }, []);

  // 🌦 WEATHER
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`
      );

      const data = await res.json();
      const temp = data.current_weather.temperature;

      if (temp < 50) {
        setMessage("Cold — layer up");
        setWeatherIcon("❄️");
      } else if (temp > 75) {
        setMessage("Warm — keep it light");
        setWeatherIcon("☀️");
      } else {
        setMessage("Perfect outfit day");
        setWeatherIcon("🌤");
      }
    });
  }, []);

  // 👕 FETCH TODAY OUTFIT
  useEffect(() => {
    const fetchOutfit = async () => {
      const snap = await getDocs(collection(db, "calendar"));
      const today = new Date().toISOString().split("T")[0];

      const match = snap.docs
        .map(doc => doc.data())
        .find(o => o.date === today);

      if (match) setTodayOutfit(match.outfit);
    };

    fetchOutfit();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex justify-center">

      <div className="w-full max-w-md min-h-screen px-5 pt-12 pb-28">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">ClosetLogic</h1>
            <p className="text-gray-500 text-sm">Welcome back 👋</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-500">
            Logout
          </button>
        </div>

        {/* 🔥 TODAY CARD */}
        <div className="bg-black text-white rounded-3xl p-6 mb-6">
          <p className="text-sm opacity-80">Today</p>
          <p className="text-xl font-semibold mt-1">
            {weatherIcon} {message}
          </p>

          {/* 👕 OUTFIT PREVIEW */}
          {todayOutfit ? (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {todayOutfit.slice(0, 4).map((item, i) =>
                item?.image ? (
                  <img
                    key={i}
                    src={item.image}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ) : null
              )}
            </div>
          ) : (
            <p className="text-xs mt-3 opacity-70">
              No outfit yet
            </p>
          )}

          <button
            onClick={() => window.location.href = "/outfit"}
            className="mt-4 bg-white text-black px-4 py-2 rounded-xl text-sm"
          >
            Style Me ✨
          </button>
        </div>

        {/* 📅 CALENDAR STRIP */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">This Week</p>

          <div className="flex space-x-3 overflow-x-auto">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() + i);
if (status === "loading") {
  return <div>Loading...</div>;
}

if (!session) {
  return <div>Not logged in</div>;
}
  return null;
}
              return (
                <div
                  key={i}
                  className="min-w-[65px] bg-white rounded-2xl p-3 shadow-sm text-center"
                >
                  <p className="text-xs">
                    {d.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="font-semibold">{d.getDate()}</p>
                  <p className="text-xs mt-1">{weatherIcon}</p>
                </div>
              );
            })}
          </div>

          <Link href="/calendar">
            <p className="text-indigo-600 text-sm mt-2">
              View Full Calendar →
            </p>
          </Link>
        </div>

        {/* MAIN ACTION */}
        <Link href="/outfit">
          <div className="bg-black text-white rounded-3xl p-6 mb-6 shadow-lg">
            <p className="text-lg font-semibold">Generate Outfit</p>
            <p className="text-sm opacity-80">
              Let AI style your look
            </p>
          </div>
        </Link>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/closet">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              My Closet
            </div>
          </Link>

          <Link href="/add">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              Add Item
            </div>
          </Link>

          <Link href="/saved">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              Saved Fits
            </div>
          </Link>

          <Link href="/calendar">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              Calendar
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}