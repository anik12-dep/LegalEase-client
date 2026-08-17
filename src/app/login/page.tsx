"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Google user after successful Google authentication
  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (status !== "authenticated" || !session?.user) {
        return;
      }

      // Prevent repeated Google login requests
      if (sessionStorage.getItem("google-login-complete") === "true") {
        return;
      }

      try {
        setGoogleLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/users/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: session.user.name || "Google User",
            email: session.user.email,
            image: session.user.image || "",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Google login failed");
        }

        sessionStorage.setItem("google-login-complete", "true");

        // Save LegalEase JWT through AuthContext
        login(data.token, data.user);

        router.push("/");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Google login failed");
        }
      } finally {
        setGoogleLoading(false);
      }
    };

    handleGoogleLogin();
  }, [session, status, login, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token, data.user);

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

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      sessionStorage.removeItem("google-login-complete");

      await signIn("google", {
        callbackUrl: "/login",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google login failed");
      }

      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Email Login */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-300" />

          <span className="px-3 text-sm text-gray-500">OR</span>

          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />

          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}
