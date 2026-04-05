"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Outfit() {
  const [items, setItems] = useState([]);
  const [outfit, setOutfit] = useState([]);
  const [temp, setTemp] = useState(null);
  const [message, setMessage] = useState("");

  // 🔄 FETCH DATA
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "clothes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    };

    fetchItems();

    // 🌦 WEATHER
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current_weather=true`
          );

          const data = await res.json();
          const t = data.current_weather.temperature;

          setTemp(t);

          if (t < 50) {
            setMessage("❄️ Cold — layer up");
          } else if (t > 75) {
            setMessage("☀️ Warm — keep it light");
          } else {
            setMessage("🌤 Perfect weather outfit");
          }
        } catch (e) {
          console.error(e);
          setMessage("Weather unavailable");
        }
      });
    }
  }, []);

  // 🎯 GENERATE OUTFIT (4 ITEMS)
  const generateOutfit = () => {
    if (items.length === 0) return;

    const tops = items.filter((i) => i.category === "top");
    const bottoms = items.filter((i) => i.category === "bottom");
    const shoes = items.filter((i) => i.category === "shoes");
    const accessories = items.filter((i) => i.category === "accessory");

    const pick = (arr) =>
      arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

    const final = [
      pick(tops),
      pick(bottoms),
      pick(shoes),
      pick(accessories),
    ].filter(Boolean);

    setOutfit(final);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] px-5 pt-10 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">Outfit Generator</h1>

      {/* 🌦 WEATHER */}
      <div className="bg-white rounded-2xl p-4 shadow mb-4">
        <p className="text-sm text-gray-500">Today’s Weather</p>

        <p className="text-xl font-semibold">
          {temp !== null ? `${Math.round(temp)}°` : "--"}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {message || "Loading weather..."}
        </p>
      </div>

      <button
        onClick={generateOutfit}
        className="w-full bg-black text-white py-3 rounded-2xl mb-4"
      >
        Generate Outfit
      </button>

      {/* 👕 OUTFIT */}
      <div className="space-y-3">
        {outfit.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-xl shadow">
            {item.image && (
              <img
                src={item.image}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            <p className="mt-2 font-semibold">
              {item.name || "Item"}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}