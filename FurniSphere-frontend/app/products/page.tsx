"use client";

import { useEffect, useState } from "react";
import { fetchCategoriesWithProducts } from "../services/productService";
import { Category } from "@/types";
import ProductModal from "../components/ProductModal";
import { addToCart } from "../services/orderServices";
import { trackUserActivity } from "../services/userActivityService";
import Recommendations from "../components/Recommendations";
import { Toaster, toast } from "react-hot-toast";

const ProductsPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategoriesWithProducts();
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleAddToCart = async (product: {
    id: number;
    name: string;
    price: number;
    image: string;
  }) => {
    try {
      await addToCart(product.id, 1); // Add to cart with quantity 1
      toast.success(`Product added to cart successfully!`);

      // Track 'add_to_cart' interaction
      await trackUserActivity(product.id, "add_to_cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  const openModal = async (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);

    // Track 'click' interaction
    await trackUserActivity(product.id, "click");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-3xl font-semibold py-10">Products</div>
        {[...Array(2)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <div className="text-2xl mb-4 bg-gray-200 h-8 w-1/4 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, productIndex) => (
                <div
                  key={productIndex}
                  className="bg-gray-200 h-80 md:h-80 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="text-3xl font-semibold py-10">Products</div>
      {/* Display Categories and Products */}
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className="mb-16">
            <div className="text-2xl mb-4">{category.name}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.products?.map((product) => (
                <div
                  key={product.id}
                  className="relative p-4 bg-white shadow rounded-xl cursor-pointer h-60 md:h-80"
                  onClick={() => openModal(product)}
                  style={{
                    backgroundImage: `url(/static/images/${product.image}.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
                    <div className="text-sm md:text-lg font-semibold">
                      {product.name}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs md:text-sm text-gray-100">
                        $
                        {typeof product.price === "number"
                          ? product.price.toFixed(2)
                          : product.price}
                      </p>
                      <button
                        className="pr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        aria-label="Add to cart"
                      >
                        <svg
                          width="35"
                          height="35"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24 39.5C18.76 39.5 14.5 35.24 14.5 30C14.5 24.76 18.76 20.5 24 20.5C29.24 20.5 33.5 24.76 33.5 30C33.5 35.24 29.24 39.5 24 39.5ZM24 23.5C20.42 23.5 17.5 26.42 17.5 30C17.5 33.58 20.42 36.5 24 36.5C27.58 36.5 30.5 33.58 30.5 30C30.5 26.42 27.58 23.5 24 23.5Z"
                            fill="white"
                          />
                          <path
                            d="M22.88 33.08C22.24 33.08 21.6 32.84 21.12 32.34L19.82 31.04C19.24 30.46 19.24 29.5 19.82 28.92C20.4 28.34 21.36 28.34 21.94 28.92L22.9 29.88L26.12 26.92C26.72 26.36 27.68 26.4 28.24 27C28.8 27.6 28.76 28.56 28.16 29.12L24.6 32.4C24.1 32.86 23.48 33.08 22.88 33.08Z"
                            fill="white"
                          />
                          <path
                            d="M30 45.5H18C8.76 45.5 7.04 41.2 6.6 37.02L5.1 25.04C4.88 22.88 4.8 19.78 6.9 17.46C8.7 15.46 11.68 14.5 16 14.5H32C36.34 14.5 39.32 15.48 41.1 17.46C43.18 19.78 43.12 22.88 42.9 25L41.4 37.02C40.96 41.2 39.24 45.5 30 45.5ZM16 17.5C12.62 17.5 10.3 18.16 9.12 19.48C8.14 20.56 7.82 22.22 8.08 24.7L9.58 36.68C9.92 39.88 10.8 42.52 18 42.52H30C37.2 42.52 38.08 39.9 38.42 36.72L39.92 24.7C40.18 22.26 39.86 20.6 38.88 19.5C37.7 18.16 35.38 17.5 32 17.5H16Z"
                            fill="white"
                          />
                          <path
                            d="M33 17.26C32.18 17.26 31.5 16.58 31.5 15.76V13C31.5 10.9 30.6 8.85999 29.04 7.43999C27.46 5.99999 25.4 5.33999 23.26 5.53999C19.66 5.87999 16.5 9.55999 16.5 13.4V15.34C16.5 16.16 15.82 16.84 15 16.84C14.18 16.84 13.5 16.16 13.5 15.34V13.38C13.5 7.99999 17.84 3.03999 22.98 2.53999C25.98 2.25999 28.86 3.19999 31.06 5.21999C33.24 7.19999 34.5 10.04 34.5 13V15.76C34.5 16.58 33.82 17.26 33 17.26Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No categories found.</div>
      )}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProductsPage;
