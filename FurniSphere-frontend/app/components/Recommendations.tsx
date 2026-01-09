'use client';
import { useEffect, useState, useCallback } from 'react';
import { fetchRecommendations } from '../services/recommendationService';
import { trackUserActivity } from '../services/userActivityService';
import { Product } from '@/types';
import ProductModal from './ProductModal';
import ProductCard from './ProductCard';
import { addToCart } from '../services/orderServices';
import toast, { Toaster } from 'react-hot-toast';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const recommendationsData = await fetchRecommendations();
        setRecommendations(recommendationsData);
      } catch (err) {
        setError('Failed to load recommendations');
        toast.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const handleAddToCart = useCallback(async (product: Product) => {
    try {
      await addToCart(product.id, 1); // Add to cart with quantity 1
      toast.success(`Product added to cart successfully!`);

      // Track 'add_to_cart' interaction
      await trackUserActivity(product.id, 'add_to_cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add product to cart.');
    }
  }, []);

  const openModal = useCallback(async (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);

    // Track 'click' interaction
    await trackUserActivity(product.id, 'click');
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (error || recommendations.length === 0) {
    return null; // Or display an alternative message
  }

  return (
    <div className="py-16 bg-gray-50">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Suggested Products
          </h2>
          <p className="text-gray-600">Based on your preferences</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCardClick={openModal}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Recommendations;
