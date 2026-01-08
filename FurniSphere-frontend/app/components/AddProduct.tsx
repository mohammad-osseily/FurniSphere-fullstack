"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createProduct } from "../services/productService";
import { Toaster, toast } from "react-hot-toast";
import {
  Loader2,
  Package,
  DollarSign,
  Palette,
  BarChart3,
  Image as ImageIcon,
} from "lucide-react";

interface AddProductFormInputs {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image: string;
  color: string;
  stock: number;
}

const AddProduct: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormInputs>();

  const onSubmit = async (data: AddProductFormInputs) => {
    try {
      await createProduct({
        ...data,
        category_id: parseInt(data.category_id),
      });
      toast.success("Product created successfully!");
    } catch (err) {
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600 mb-6">
            Fill in the details to add a new product to your inventory.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter product name"
                    {...register("name", {
                      required: "Product name is required",
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    {...register("price", { required: "Price is required" })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category_id"
                  {...register("category_id", {
                    required: "Category is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a category</option>
                  <option value="1">Featured 3D Products</option>
                  <option value="2">Chair</option>
                  <option value="3">Sofa</option>
                  <option value="4">Table</option>
                </select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700"
                >
                  Color
                </label>
                <div className="relative">
                  <Palette className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="color"
                    type="text"
                    placeholder="Enter color"
                    {...register("color")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock
                </label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="stock"
                    type="number"
                    placeholder="Enter stock quantity"
                    {...register("stock", {
                      required: "Stock is required",
                      min: 0,
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="image"
                    type="text"
                    placeholder="Enter image URL"
                    {...register("image")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter product description"
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Adding Product...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
