"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Closet() {
  const [items, setItems] = useState([]);

  // 🗑 DELETE
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "clothes", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // 📦 FETCH
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
  }, []);

  // 🧠 GROUP ITEMS
  const groupedItems = {
    top: items.filter((i) => i.category === "top"),
    bottom: items.filter((i) => i.category === "bottom"),
    shoes: items.filter((i) => i.category === "shoes"),
    accessory: items.filter((i) => i.category === "accessory"),
  };

  const categoryNames = {
    top: "Tops",
    bottom: "Bottoms",
    shoes: "Shoes",
    accessory: "Accessories",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 max-w-md mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Closet</h1>
        <p className="text-gray-500 text-sm">Your personal wardrobe 👕</p>
      </div>

      {/* BACK */}
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="text-sm text-gray-600"
      >
        ← Back
      </button>

      {/* 👕 GROUPED SECTIONS */}
      {Object.entries(groupedItems).map(([category, list]) => {
        if (list.length === 0) return null;

        return (
          <div key={category}>

            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-3">
              {categoryNames[category]}
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">

              {list.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/70 backdrop-blur-md rounded-3xl shadow-md overflow-hidden"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="h-36 bg-gray-200" />
                  )}

                  <div className="p-2">
                    <p className="font-semibold text-sm">
                      {item.name || "Item"}
                    </p>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="mt-2 w-full bg-red-50 text-red-600 py-1 rounded-xl text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        );
      })}

      {/* ➕ ADD BUTTON */}
      <button
        onClick={() => (window.location.href = "/add")}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-4 rounded-full shadow-xl text-base font-medium active:scale-95 transition"
      >
        + Add Item
      </button>

    </div>
  );
}