'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { Product } from '@/types';
import { Heart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onCardClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isBestSeller?: boolean;
  showFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCardClick,
  onAddToCart,
  isBestSeller = false,
  showFavorite = true,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onAddToCart) {
        onAddToCart(product);
      }
    },
    [onAddToCart, product]
  );

  const handleCardClick = useCallback(() => {
    if (onCardClick) {
      onCardClick(product);
    }
  }, [onCardClick, product]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick]
  );

  const handleFavoriteKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFavorite((prev) => !prev);
    }
  }, []);

  const handleDotClick = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex(index);
    },
    []
  );

  const imageUrl = useMemo(
    () =>
      imageError
        ? '/static/images/placeholder.jpg'
        : `/static/images/${product.image}.jpg`,
    [imageError, product.image]
  );

  // Simulate multiple images for pagination dots (you can replace this with actual product images array)
  const imageCount = 3; // This can be dynamic based on product data

  return (
    <div
      className="relative bg-base-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer will-change-transform"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.name}`}
    >
      {/* Image Card Container - Inner Card */}
      <div className="relative aspect-square overflow-hidden bg-base-100 rounded-lg mb-4">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-base-300 animate-pulse" />
        )}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className={`object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority={false}
          unoptimized
          onError={handleImageError}
          onLoadingComplete={handleImageLoad}
        />

        {/* Best Seller Badge */}
        {isBestSeller && (
          <div className="absolute top-3 left-3 bg-base-200 rounded-full px-3 py-1 shadow-sm">
            <span className="text-xs font-medium text-neutral">
              Best Seller
            </span>
          </div>
        )}

        {/* Favorite Heart Icon */}
        {showFavorite && (
          <button
            onClick={handleFavoriteClick}
            onKeyDown={handleFavoriteKeyDown}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-base-200/80 hover:bg-base-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-neutral shadow-sm"
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            tabIndex={0}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-error text-error' : 'text-neutral'
              }`}
            />
          </button>
        )}

        {/* Pagination Dots */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {Array.from({ length: imageCount }).map((_, index) => (
              <button
                key={index}
                onClick={handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-success' : 'bg-base-300'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div>
        {/* Brand/Category Name */}
        <p className="text-sm text-success mb-1 font-medium">FurniSphere</p>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-neutral mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-semibold text-neutral">
            $
            {typeof product.price === 'number'
              ? product.price.toFixed(2)
              : product.price}
          </span>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleAddToCart}
          className="w-full px-4 py-3 bg-primary text-base-200 rounded-xl font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Buy now"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.image === nextProps.product.image &&
    prevProps.isBestSeller === nextProps.isBestSeller &&
    prevProps.showFavorite === nextProps.showFavorite &&
    prevProps.onCardClick === nextProps.onCardClick &&
    prevProps.onAddToCart === nextProps.onAddToCart
  );
});
