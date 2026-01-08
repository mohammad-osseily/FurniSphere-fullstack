// components/ProductList.tsx
import React from "react";
import { Product } from "@/types";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 flex flex-col items-center"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="text-xl font-semibold mb-2">{product.name}</div>
          <p className="text-gray-500 mb-2">${product.price}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
