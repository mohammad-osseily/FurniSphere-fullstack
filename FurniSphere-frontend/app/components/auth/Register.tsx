"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { registerUser } from "../../services/authServices";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Link from "next/link";
import { User, Mail, Lock, UserPlus } from "lucide-react";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser(data.name, data.email, data.password);

      Swal.fire({
        title: "Success!",
        text: "You have registered successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Registration failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-login-bg bg-cover bg-center px-4 py-12">
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h1>
          <p className="text-gray-600 mt-2">Join us and start your journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 block"
            >
              Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password_confirmation"
              className="text-sm font-medium text-gray-700 block"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                {...register("password_confirmation", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "The passwords do not match",
                })}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark transition duration-300 flex items-center justify-center space-x-2"
            >
              <span>Register</span>
              <UserPlus size={20} />
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
