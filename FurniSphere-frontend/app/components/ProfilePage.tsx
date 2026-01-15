"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfile, getUserFromLocalStorage } from "../services/authServices";
import { User, Mail, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <ToastContainer />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/85 shadow-xl shadow-gray-200/40 backdrop-blur">
          <div className="bg-gradient-to-r from-primary to-indigo-500 px-6 py-7 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-white/80">Profile</p>
            <h1 className="mt-2 text-3xl font-semibold">Manage your account</h1>
            <p className="mt-1 text-sm text-white/90">
              Update your info and keep your credentials secure.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-8 md:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-700 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Current profile</h2>
                <p className="mt-1 text-sm text-gray-700">
                  {user?.name || "Guest"} — {user?.email || "Not signed in"}
                </p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-3 text-xs text-primary">
                Tip: Use a unique password and keep your email up to date for notifications.
              </div>
            </div>

            <div className="space-y-4">
              {serverErrors && (
                <div
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  <strong className="font-semibold">Error:</strong> {serverErrors.message}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 rounded-xl border border-gray-100 bg-white px-5 py-6 shadow-sm"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                    Name
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register("name", { required: "Name is required" })}
                      id="name"
                      className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                      type="text"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                    Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      id="email"
                      className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                      type="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                      New password (optional)
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        {...register("password", {
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        id="password"
                        className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                        type="password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-800">
                      Confirm password
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        {...register("password_confirmation", {
                          validate: (value) =>
                            !password || value === password || "Passwords do not match",
                        })}
                        id="password_confirmation"
                        className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                        type="password"
                      />
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update profile"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
