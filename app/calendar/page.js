"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export default function CalendarPage() {
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOutfits, setCalendarOutfits] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [temp, setTemp] = useState(null);
  const [message, setMessage] = useState("");

  // 📅 GENERATE DAYS
  const generateDays = () => {
    const today = new Date();
    let arr = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const iso = d.toISOString().split("T")[0];

      arr.push({
        date: iso,
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        day: d.getDate()
      });

      if (i === 0) setSelectedDate(iso);
    }

    setDays(arr);
  };

  // 📦 FETCH CALENDAR
  const fetchCalendar = async () => {
    const snap = await getDocs(collection(db, "calendar"));
    const data = snap.docs.map(doc => doc.data());
    setCalendarOutfits(data);
  };

  // 📦 FETCH SAVED OUTFITS
  const fetchSavedOutfits = async () => {
    const snap = await getDocs(collection(db, "outfits"));
    const data = snap.docs.map(doc => doc.data());
    setSavedOutfits(data);
  };

  // 🔔 NOTIFICATIONS
  const sendNotification = (text) => {
    if (Notification.permission === "granted") {
      new Notification("Closet AI", { body: text });
    }
  };

  // 🌦 WEATHER
  const getWeather = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`
      );

      const data = await res.json();
      const t = data.current_weather.temperature;

      setTemp(t);

      if (t < 50) {
        setMessage("❄️ Cold — wear layers");
        sendNotification("Wear a jacket today ❄️");
      } else if (t > 75) {
        setMessage("☀️ Warm — go light");
        sendNotification("Perfect day for shorts ☀️");
      } else {
        setMessage("🌤 Perfect outfit day");
      }
    });
  };
const autoFillWeek = async () => {
  if (savedOutfits.length === 0) {
    alert("No saved outfits");
    return;
  }

  const today = new Date();

  // 🔀 SHUFFLE OUTFITS
  const shuffled = [...savedOutfits].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const date = d.toISOString().split("T")[0];

    // 🔁 ROTATE (no repeats until necessary)
    const outfitIndex = i % shuffled.length;
    const selected = shuffled[outfitIndex];

    await setDoc(doc(db, "calendar", date), {
      date,
      outfit: selected.items
    });
  }

  fetchCalendar();
};
  // 🧠 SMART OUTFIT PICK
  const pickOutfit = () => {
    if (savedOutfits.length === 0) return null;

    const allItems = savedOutfits.flatMap(o => o.items || []);

    let filtered = allItems;

    if (temp < 50) {
      filtered = allItems.filter(i =>
        i.name.toLowerCase().includes("jacket") ||
        i.name.toLowerCase().includes("hoodie")
      );
    }

    if (temp > 75) {
      filtered = allItems.filter(i =>
        i.name.toLowerCase().includes("shorts") ||
        i.name.toLowerCase().includes("tee")
      );
    }

    if (filtered.length === 0) filtered = allItems;

    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  // ➕ ASSIGN OUTFIT
  const assignOutfit = async (date) => {
    const item = pickOutfit();

    if (!item) {
      alert("No outfits available");
      return;
    }

    await setDoc(doc(db, "calendar", date), {
      date,
      outfit: [item]
    });

    fetchCalendar();
  };

  // 🔍 GET OUTFIT FOR DAY
  const getOutfit = (date) => {
    return calendarOutfits.find(o => o.date === date);
  };

  // 🚀 LOAD EVERYTHING
  useEffect(() => {
    generateDays();
    fetchCalendar();
    fetchSavedOutfits();
    getWeather();

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const selectedOutfit = getOutfit(selectedDate);

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="pt-12 px-5 pb-3">
        <h1 className="text-4xl font-bold">Calendar</h1>
        <p className="text-gray-500 text-sm mt-1">{message}</p>
      </div>
<button
  onClick={autoFillWeek}
  className="bg-black text-white px-4 py-2 rounded-xl mb-4"
>
  Auto Fill Week ✨
</button>
      {/* DAY STRIP */}
      <div className="flex space-x-4 overflow-x-auto px-4 pb-4">
        {days.map((d) => (
          <div
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex flex-col items-center min-w-[60px] py-2 rounded-2xl ${
              selectedDate === d.date
                ? "bg-black text-white"
                : "bg-[#f2f2f7]"
            }`}
          >
            <p className="text-xs">{d.label}</p>
            <p className="text-lg font-semibold">{d.day}</p>
          </div>
        ))}
      </div>

      {/* OUTFIT DISPLAY */}
      <div className="px-5 mt-4">
        {selectedOutfit?.outfit ? (
          <div className="grid grid-cols-2 gap-3">
            {selectedOutfit.outfit.map((item, i) =>
              item?.image ? (
                <img
                  key={`${item.id || i}-${i}`}
                  src={item.image}
                  className="w-full h-40 object-cover rounded-2xl"
                />
              ) : null
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-20">
            No outfit yet
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={() => assignOutfit(selectedDate)}
          className="w-full mt-6 bg-black text-white py-3 rounded-2xl"
        >
          Auto Pick Outfit ✨
        </button>
      </div>

    </div>
  );
}