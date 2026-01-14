import React from "react";
import Image from "next/image";

const categories = [
  { id: 1, name: "table", image: "/static/images/table.jpg" },
  { id: 2, name: "sofa", image: "/static/images/sofa.jpg" },
  { id: 3, name: "chair", image: "/static/images/chair.jpg" },
];

const ProductCategories = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral mb-6 sm:mb-8 md:mb-12 text-center">
          Browse The Range
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => (
            <div key={category.id} className="text-center group cursor-pointer">
              <div className="relative w-full h-64 sm:h-80 md:h-96 mb-3 sm:mb-4 overflow-hidden rounded-lg">
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold capitalize text-neutral">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
