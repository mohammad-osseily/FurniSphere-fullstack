"use client";
import { useState } from "react";
import axios from "axios";

export default function SuggestedProducts() {
  const [interest, setInterest] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setInterest(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!interest) {
      setError("Please enter your interest");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8001/recommend", {
        interests: interest,
      });
      setRecommendations(response.data);
    } catch (err) {
      setError("Failed to fetch recommendations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Suggested Products</h1>
      <form onSubmit={handleFormSubmit} className="mb-8">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="interest"
        >
          Enter your interest:
        </label>
        <input
          type="text"
          id="interest"
          name="interest"
          value={interest}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g. electronics, furniture, etc."
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Get Recommendations
        </button>
      </form>

      {loading && <p>Loading recommendations...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended Products:</h2>
          <ul>
            {recommendations.map((product, index) => (
              <li key={index} className="mb-4 border p-4 rounded shadow">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Similarity Score: {product.similarity.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
