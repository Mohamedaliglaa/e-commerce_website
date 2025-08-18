'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { ProductWithImages } from "@/types";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router } = useAppContext();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState(0);

  const fetchSellerProduct = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: ProductWithImages[] = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProduct();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const res = await fetch("/api/products/id", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setProducts(products.filter(p => p.id !== id));
      toast.success("Produit supprimé !");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de supprimer le produit.");
    }
  };

  const openUpdateDialog = (product: ProductWithImages) => {
    setEditingProduct(product);
    setUpdatedName(product.name);
    setUpdatedPrice(product.price);
    setUpdateDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch("/api/products/id", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          name: updatedName,
          price: updatedPrice,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      // Update in local state
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, name: updatedName, price: updatedPrice } : p));
      toast.success("Produit mis à jour !");
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de mettre à jour le produit.");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        {product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt="product Image"
                            className="w-16"
                            width={64}
                            height={64}
                            unoptimized
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category?.name ?? "N/A"}</td>
                    <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-3 max-sm:hidden flex gap-2">
                      <button
                        onClick={() => openUpdateDialog(product)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />

      {/* Update Dialog */}
      {updateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4">
            <h3 className="text-lg font-semibold">Update Product</h3>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Product Name"
            />
            <input
              type="number"
              value={updatedPrice}
              onChange={(e) => setUpdatedPrice(Number(e.target.value))}
              className="w-full border p-2 rounded"
              placeholder="Product Price"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUpdateDialogOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-orange-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
