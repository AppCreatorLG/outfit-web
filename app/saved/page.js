"use client";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SavedOutfits() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const snapshot = await getDocs(collection(db, "outfits"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setOutfits(data.reverse());
      } catch (err) {
        console.error(err);
      }
    };

    fetchOutfits();
  }, []);
const handleDelete = async (id) => {
  try {
    await deleteDoc(doc(db, "outfits", id));

    // 🔥 instant UI update
    setOutfits((prev) => prev.filter((o) => o.id !== id));

  } catch (err) {
    console.error(err);
    alert("Failed to delete outfit");
  }
};
  return (
    <div className="min-h-screen bg-[#f2f2f7] px-4 pt-10 pb-24 max-w-md mx-auto">

      {/* HEADER */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="text-sm mr-3"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Saved Fits</h1>
      </div>

      {/* EMPTY STATE */}
      {outfits.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No saved outfits yet
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">

{outfits.map((outfit) => (
  <div
    key={outfit.id}
    className="bg-white rounded-3xl p-2 shadow-sm"
  >
    <div className="grid grid-cols-2 gap-1">

      {outfit.items?.slice(0, 4).map((item, i) =>
        item?.image ? (
          <img
            key={i}
            src={item.image}
            alt={item.name}
            className="w-full h-20 object-cover rounded-xl"
          />
        ) : (
          <div
            key={i}
            className="w-full h-20 bg-gray-200 rounded-xl"
          />
        )
      )}

    </div>

    {/* DATE */}
    <p className="text-xs text-gray-400 mt-2 text-center">
      {outfit.createdAt?.seconds
        ? new Date(outfit.createdAt.seconds * 1000).toLocaleDateString()
        : ""}
    </p>

    {/* DELETE BUTTON */}
    <button
      onClick={() => {
        if (window.confirm("Delete this outfit?")) {
          handleDelete(outfit.id);
        }
      }}
      className="mt-2 w-full bg-red-50 text-red-600 py-1 rounded-xl text-xs"
    >
      Delete
    </button>

  </div>

        ))}

      </div>

    </div>
  );
}