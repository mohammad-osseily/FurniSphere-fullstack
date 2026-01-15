'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { addToCart } from '../services/orderServices';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentImageIndex(0);
      setImageLoaded(false);
      setImageError(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleAddToCart = useCallback(async () => {
    if (!product) return;

    try {
      await addToCart(product.id, 1);
      toast.success('Product added to cart successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add product to cart.');
    }
  }, [product, onClose]);

  const handleImageNavigation = useCallback((direction: 'prev' | 'next') => {
    setCurrentImageIndex((prev) => {
      const imageCount = 3; // This can be dynamic based on product data
      if (direction === 'prev') {
        return prev === 0 ? imageCount - 1 : prev - 1;
      } else {
        return prev === imageCount - 1 ? 0 : prev + 1;
      }
    });
  }, []);

  const formatPrice = useCallback((price: number | string): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? price : numPrice.toFixed(2);
    }
    return 'N/A';
  }, []);

  const imageUrl = useMemo(() => {
    if (!product) return '';
    if (imageError) return '/static/images/placeholder.jpg';
    return `/static/images/${product.image}.jpg`;
  }, [product, imageError]);

  const imageCount = 3; // This can be dynamic based on product data

  if (!isOpen && !isVisible) return null;
  if (!product) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className={`bg-base-200 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transition-all duration-300 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-base-200/90 hover:bg-base-200 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-neutral" />
          </button>
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2 p-6 flex items-center justify-center bg-base-100 relative">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-base-300 animate-pulse rounded-lg" />
            )}
          <div className="relative w-full aspect-square max-h-[500px]">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`rounded-lg object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              priority
              unoptimized
              onError={() => setImageError(true)}
              onLoadingComplete={() => setImageLoaded(true)}
            />

              {/* Image Navigation Arrows */}
              {imageCount > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-base-200/90 hover:bg-base-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-neutral shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-base-200/90 hover:bg-base-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-neutral shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-neutral" />
                  </button>
                </>
              )}

              {/* Image Pagination Dots */}
              {imageCount > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {Array.from({ length: imageCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-success' : 'bg-base-300'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Brand */}
              <p className="text-sm text-success mb-2 font-medium">FurniSphere</p>

              {/* Product Name */}
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
                {product.name}
              </h2>
              
              {/* Price */}
              <p className="text-3xl font-bold text-primary mb-6">
                ${formatPrice(product.price)}
              </p>

              {/* Color */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral mb-2">Color</h3>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-base-100 rounded-lg text-neutral font-medium border border-base-300">
                    {product.color}
                  </span>
                </div>
              </div>

              {/* Stock */}
              {product.stock !== undefined && product.stock !== null && (
                <div className="mb-6">
                  <p className="text-sm text-neutral">
                    {product.stock > 0 ? (
                      <span className="text-success">In Stock ({product.stock} available)</span>
                    ) : (
                      <span className="text-error">Out of Stock</span>
                    )}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral mb-2">Description</h3>
                <p className="text-neutral leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-6">
            <button
              onClick={handleAddToCart}
                disabled={product.stock !== undefined && product.stock !== null && product.stock === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-base-200 rounded-xl font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {product.stock !== undefined && product.stock !== null && product.stock === 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </span>
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;


