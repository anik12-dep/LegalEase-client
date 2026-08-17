"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTie,
  FaGoogle,
} from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);

      setSuccess("Registration successful!");

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/",
      });
    } catch {
      setError("Google registration failed");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>

          <p className="mt-2 text-sm text-gray-500">
            Join LegalEase and get started today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border py-3 pl-10 pr-3 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border py-3 pl-10 pr-3 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border py-3 pl-10 pr-11 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-md border py-3 pl-10 pr-11 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Role
            </label>

            <div className="relative">
              <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border bg-white py-3 pl-10 pr-3 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="user">User (Client)</option>
                <option value="lawyer">Lawyer</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="rounded-md bg-green-50 p-3 text-sm text-green-600">
              {success}
            </p>
          )}

          {/* Register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-500">OR</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaGoogle className="text-red-500" />

          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}
