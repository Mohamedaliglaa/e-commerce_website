import { Suspense } from "react";
import AllProductsClient from "./AllProductsClient";

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <AllProductsClient />
    </Suspense>
  );
}
