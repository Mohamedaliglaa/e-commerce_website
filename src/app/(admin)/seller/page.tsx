'use client'
import React, { useState, useEffect, ChangeEvent } from "react";
import { assets } from "../../../../assets/assets";
import Image from "next/image";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import prisma from "@/lib/prisma";

interface Category {
  id: string;
  name: string;
}

const AddProduct: React.FC = () => {
  const [files, setFiles] = useState<(File | undefined)[]>([undefined, undefined, undefined, undefined]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([0, 0, 0, 0]);
  const [downloadURLs, setDownloadURLs] = useState<string[]>(["", "", "", ""]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  // Fetch categories
  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();
        setCategories(data);
        if (data.length > 0) setCategory(data[0].id);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Upload file helper
  const uploadFile = (file: File, index: number) => {
    if (!file) return;

    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index] = progress;
          return newProgress;
        });
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURLs((prev) => {
          const newURLs = [...prev];
          newURLs[index] = url;
          return newURLs;
        });
      }
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles((prevFiles) => {
      if (prevFiles[index]) URL.revokeObjectURL(URL.createObjectURL(prevFiles[index]!));
      const newFiles = [...prevFiles];
      newFiles[index] = file;
      return newFiles;
    });

    uploadFile(file, index);
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file) URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [files]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!downloadURLs.every((url) => url)) {
      alert("Please wait until all images are uploaded!");
      return;
    }

    const productData = {
      name,
      description,
      categoryId: category,
      price: Number(price),
      quantity: Number(quantity),
      images: downloadURLs,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }
      alert("Product added successfully");
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        {/* Product Images */}
        <div>
          <p className="text-base font-medium">Product Images (4)</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`} className="flex flex-col items-center">
                <input
                  type="file"
                  id={`image${index}`}
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                />
                <Image
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index]!)
                      : assets.upload_area
                  }
                  alt={`Product ${index}`}
                  width={100}
                  height={100}
                />
                {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                  <p className="text-xs text-gray-500">{Math.round(uploadProgress[index])}%</p>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <textarea
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </div>

        {/* Category, Price, Quantity */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium">Category</label>
            <select
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
              min={0}
              step="0.01"
            />
          </div>

          <div className="flex flex-col gap-1 w-24">
            <label className="text-base font-medium">Quantity</label>
            <input
              type="number"
              placeholder="1"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              required
              min={1}
            />
          </div>
        </div>

        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
