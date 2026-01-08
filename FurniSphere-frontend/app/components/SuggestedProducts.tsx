const products = [
  { id: 1, name: "Classy Sofa", price: "$499", image: "/images/sofa1.png" },
  { id: 2, name: "Elegant Chair", price: "$199", image: "/images/chair1.png" },
  // Add more products here
];

const SuggestedProducts = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-8">Suggested Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded shadow-lg text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-700">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedProducts;
