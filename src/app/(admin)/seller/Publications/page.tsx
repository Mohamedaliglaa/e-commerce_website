"use client";

import React, { useEffect, useState } from "react";
import { storage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

interface Slide {
  id: string;
  title: string;
  offer: string;
  buttonText1: string;
  buttonText2: string;
  imgUrl: string;
}

const HeaderSlidesManager = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    offer: "",
    buttonText1: "",
    buttonText2: "",
    imgUrl: "",
  });
  const [uploading, setUploading] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/header-slides");
      if (!res.ok) throw new Error("Failed to fetch slides");
      const data: Slide[] = await res.json();
      setSlides(data);
    } catch (error) {
      toast.error("Failed to load slides");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `header-slides/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      () => {
        // Optional: progress handler
      },
      (error) => {
        console.error(error);
        toast.error("Image upload failed, please try again.");
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, imgUrl: url }));
        toast.success("Image uploaded successfully!");
        setUploading(false);
      }
    );
  };

  const resetForm = () => {
    setFormData({
      title: "",
      offer: "",
      buttonText1: "",
      buttonText2: "",
      imgUrl: "",
    });
    setEditingId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (slide: Slide) => {
    setFormData({
      title: slide.title,
      offer: slide.offer,
      buttonText1: slide.buttonText1,
      buttonText2: slide.buttonText2,
      imgUrl: slide.imgUrl,
    });
    setEditingId(slide.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imgUrl) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/header-slides/byid`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
      } else {
        res = await fetch("/api/header-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error("Failed to save slide");

      toast.success(editingId ? "Slide updated successfully!" : "Slide created successfully!");
      setIsDialogOpen(false);
      resetForm();
      fetchSlides();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save slide. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`/api/header-slides/byid`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, _method: "DELETE" }),
      });

      if (!res.ok) throw new Error("Failed to delete slide");

      toast.success("Slide deleted successfully!");
      fetchSlides();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete slide. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Header Slides Manager</h1>

      <div className="flex justify-center sm:justify-start mb-6">
        <button
          onClick={openCreateDialog}
          className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition w-full max-w-xs sm:max-w-none"
        >
          New Slide
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading slides...</p>
      ) : slides.length === 0 ? (
        <p className="text-center">No slides found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border rounded-lg p-4 shadow-md w-full"
            >
              <img
                src={slide.imgUrl}
                alt={slide.title}
                className="w-full sm:w-32 h-32 rounded-md object-cover flex-shrink-0"
              />
              <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-semibold">{slide.title}</h2>
                <p className="text-gray-600 truncate">{slide.offer}</p>
                <p className="mt-1 text-sm text-gray-700">
                  Buttons: <span className="font-medium">{slide.buttonText1}</span> |{" "}
                  <span className="font-medium">{slide.buttonText2}</span>
                </p>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0 sm:flex-col">
                <button
                  onClick={() => openEditDialog(slide)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-3xl leading-none"
              aria-label="Close dialog"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              {editingId ? "Edit Slide" : "New Slide"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-gray-700 font-medium mb-1 block">Title</span>
                <input
                  name="title"
                  placeholder="Enter slide title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-1 block">Offer</span>
                <textarea
                  name="offer"
                  placeholder="Enter offer text"
                  value={formData.offer}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-1 block">Button Text 1</span>
                <input
                  name="buttonText1"
                  placeholder="Text for first button"
                  value={formData.buttonText1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-1 block">Button Text 2</span>
                <input
                  name="buttonText2"
                  placeholder="Text for second button"
                  value={formData.buttonText2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-1 block">Slide Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={uploading}
                />
              </label>

              {uploading && (
                <p className="text-sm text-gray-500 text-center mt-2">Uploading image...</p>
              )}

              {formData.imgUrl && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={formData.imgUrl}
                    alt="Slide Preview"
                    className="w-40 h-40 rounded-md object-cover shadow-md"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md transition"
              >
                {uploading ? "Uploading..." : editingId ? "Update Slide" : "Create Slide"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSlidesManager;
