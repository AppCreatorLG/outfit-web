"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

export default function AddItem() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 📸 IMAGE UPLOAD HANDLER (camera + library)
  const handleImageUpload = async (file) => {
    try {
      setUploading(true);

      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const fileRef = ref(storage, `clothes/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, compressedFile);

      const url = await getDownloadURL(fileRef);
      setImage(url);

      setUploading(false);
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
      setUploading(false);
    }
  };

  // 🧾 SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  let finalImage = "";

  // ✅ Uploaded image (Firebase)
  if (image && image.startsWith("http")) {
    finalImage = image;
  }

  // ✅ Image URL
  else if (imageUrl) {
    if (imageUrl.startsWith("http")) {
      finalImage = imageUrl;
    } else {
      finalImage = "https://" + imageUrl;
    }
  }

  console.log("FINAL IMAGE:", finalImage);

  try {
    await addDoc(collection(db, "clothes"), {
      name: name || "Untitled Item",
      category: category || "",
      image: finalImage,
      color: color || "",
      style: style || "",
      createdAt: new Date()
    });

    // 🔄 reset
    setName("");
    setCategory("");
    setImage("");
    setImageUrl("");
    setColor("");
    setStyle("");

    alert("Item added ✨");

  } catch (error) {
    console.error(error);
    alert("Error saving item");
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen bg-[#f2f2f7] px-5 pt-10 pb-24 max-w-md mx-auto">

      {/* HEADER */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="text-sm mr-3"
        >
        
          ← Back
        
        </button>
        
        <h1 className="text-2xl font-bold">Add Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
{/* 🏷 NAME */}
<input
  placeholder="Item name (e.g. Black Hoodie)"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full p-3 border rounded-xl"
/>
        {/* 📸 CAMERA */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Take Photo</p>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleImageUpload(file);
            }}
            className="w-full"
          />
        </div>

        {/* 🖼 LIBRARY */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Upload from Library</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleImageUpload(file);
            }}
            className="w-full"
          />
        </div>
{/* 🔗 IMAGE URL */}
<input
  placeholder="Paste Image URL (optional)"
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
  className="w-full p-3 border rounded-xl"
/>

        {/* ⏳ Uploading */}
        {uploading && (
          <p className="text-sm text-indigo-600">Uploading image...</p>
        )}
{/* 🖼 PREVIEW */} {(image || imageUrl) && ( <img src={image || imageUrl} className="w-full h-48 object-cover rounded-xl" /> )}

        {/* COLOR */}
        <input
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        {/* STYLE */}
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-3 border rounded-xl bg-white"
        >
          <option value="">Select Style</option>
          <option value="casual">Casual</option>
          <option value="business">Business</option>
        </select>

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-xl bg-white"
        >
          <option value="">Select Category</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="shoes">Shoes</option>
          <option value="accessory">Accessory</option>
        </select>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-black text-white py-4 rounded-2xl font-medium active:scale-95 transition"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>

      </form>
    </div>
  );
}