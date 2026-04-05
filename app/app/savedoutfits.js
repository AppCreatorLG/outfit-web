"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddItem() {

  // ✅ STATE
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");

  // 📸 HANDLE FILE UPLOAD (camera or library)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ONLY required fields
    if (!name || !category) {
      alert("Please add a name and category");
      return;
    }

    await addDoc(collection(db, "clothes"), {
      name,
      category,
      image: image || "", // optional
      color: color || "",
      style: style || "",
      createdAt: new Date()
    });

    // reset form
    setName("");
    setCategory("");
    setImage("");
    setImageFile(null);
    setColor("");
    setStyle("");

    alert("Item added ✨");
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] px-5 pt-10 max-w-md mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Add Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <input
          placeholder="Item name (required)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-2xl bg-white"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-2xl bg-white"
        >
          <option value="">Select category (required)</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="shoes">Shoes</option>
          <option value="accessory">Accessory</option>
        </select>

        {/* IMAGE UPLOAD */}
        <div className="bg-white p-4 rounded-2xl">
          <p className="text-sm mb-2">Upload image (optional)</p>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
          />
        </div>

        {/* IMAGE URL */}
        <input
          placeholder="Or paste image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-3 rounded-2xl bg-white"
        />

        {/* PREVIEW */}
        {image && (
          <img
            src={image}
            className="w-full h-48 object-cover rounded-2xl"
          />
        )}

        {/* COLOR (OPTIONAL) */}
        <input
          placeholder="Color (optional)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-3 rounded-2xl bg-white"
        />

        {/* STYLE (OPTIONAL) */}
        <input
          placeholder="Style (optional)"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-3 rounded-2xl bg-white"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-2xl"
        >
          Add Item ✨
        </button>

      </form>

    </div>
  );
}