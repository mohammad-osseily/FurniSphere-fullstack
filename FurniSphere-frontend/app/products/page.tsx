'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchCategoriesWithProducts } from '../services/productService';
import { Category } from '@/types';
import ProductModal from '../components/ProductModal';
import ProductCard from '../components/ProductCard';
import { addToCart } from '../services/orderServices';
import { trackUserActivity } from '../services/userActivityService';
import Recommendations from '../components/Recommendations';
import { Toaster, toast } from 'react-hot-toast';

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
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleAddToCart = useCallback(
    async (product: {
      id: number;
      name: string;
      price: number;
      image: string;
    }) => {
      try {
        await addToCart(product.id, 1); // Add to cart with quantity 1
        toast.success(`Product added to cart successfully!`);

        // Track 'add_to_cart' interaction
        await trackUserActivity(product.id, 'add_to_cart');
      } catch (error) {
        console.error('Failed to add to cart:', error);
        toast.error('Failed to add product to cart.');
      }
    },
    []
  );

  const openModal = useCallback(async (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);

    // Track 'click' interaction
    await trackUserActivity(product.id, 'click');
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster position="top-right" />
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Discover our furniture collection</p>
      </div>
      {/* Display Categories and Products */}
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className="mb-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCardClick={openModal}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found.</p>
        </div>
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
