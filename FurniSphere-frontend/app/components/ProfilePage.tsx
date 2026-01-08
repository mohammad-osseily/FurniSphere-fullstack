"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfile, getUserFromLocalStorage } from "../services/authServices";
import { User, Mail, Lock } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileFormInputs {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

interface ServerError {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

const ProfilePage = () => {
  const [user, setUser] = useState(getUserFromLocalStorage());
  const [loading, setLoading] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<ServerError | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setError,
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    const currentUser = getUserFromLocalStorage();
    setUser(currentUser);
    reset({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
    });
  }, [reset]);

  const onSubmit = async (data: ProfileFormInputs) => {
    setLoading(true);
    setServerErrors(null);

    // Convert form data to string explicitly to ensure correct type
    const formData: ProfileFormInputs = {
      name: String(data.name),
      email: String(data.email),
      password: data.password ? String(data.password) : undefined,
      password_confirmation: data.password_confirmation ? String(data.password_confirmation) : undefined,
    };

    try {
      await updateProfile(formData.name, formData.email, formData.password, formData.password_confirmation);
      const updatedUser = getUserFromLocalStorage();
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        try {
          const serverError = JSON.parse(error.message) as ServerError;
          setServerErrors(serverError);
          
          // Set errors for each field
          Object.keys(serverError.errors).forEach((key) => {
            setError(key as keyof ProfileFormInputs, {
              type: "server",
              message: serverError.errors[key][0],
            });
          });
        } catch (parseError) {
          toast.error(error.message || "An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Update Profile</h1>
      {serverErrors && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {serverErrors.message}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-md rounded-lg p-6">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register("name", { required: "Name is required" })}
              id="name"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
              type="text"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register("email", { 
                required: "Email is required", 
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                  message: "Invalid email address" 
                } 
              })}
              id="email"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
              type="email"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            New Password (optional)
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register("password", { 
                minLength: { 
                  value: 8, 
                  message: "Password must be at least 8 characters" 
                } 
              })}
              id="password"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
              type="password"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register("password_confirmation", { 
                validate: value => 
                  !password || value === password || "Passwords do not match"
              })}
              id="password_confirmation"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
              type="password"
            />
          </div>
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
