import React from "react";
import Image from "next/image";

const categories = [
  { id: 1, name: "table", image: "/static/images/table.jpg" },
  { id: 2, name: "sofa", image: "/static/images/sofa.jpg" },
  { id: 3, name: "chair", image: "/static/images/chair.jpg" },
];

const ProductCategories = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12">Browse The Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="text-center">
              <div className="relative w-full h-96 mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-medium capitalize text-gray-800">
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
