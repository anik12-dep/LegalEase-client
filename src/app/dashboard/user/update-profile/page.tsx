"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  if (authLoading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        {" "}
        <h1 className="text-3xl font-bold text-gray-900">
          {" "}
          Update Profile{" "}
        </h1>{" "}
        <p className="mt-8 text-center text-gray-500">
          {" "}
          Loading profile...{" "}
        </p>{" "}
      </main>
    );
  }
  if (!token || !user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        {" "}
        <h1 className="text-3xl font-bold text-gray-900">
          {" "}
          Update Profile{" "}
        </h1>{" "}
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          {" "}
          <p className="text-red-600">
            {" "}
            You must be logged in to update your profile.{" "}
          </p>{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            {" "}
            Go to Login{" "}
          </button>{" "}
        </div>{" "}
      </main>
    );
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Full name is required.");
      setSuccess("");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      const response = await fetch("http://localhost:5000/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), image: image.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }
      setSuccess("Profile updated successfully.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Update Profile Error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {" "}
      <div className="rounded-xl border bg-white p-6 shadow-sm sm:p-8">
        {" "}
        {/* Header */}{" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-gray-900">
            {" "}
            Update Profile{" "}
          </h1>{" "}
          <p className="mt-2 text-gray-600">
            {" "}
            Update your personal profile information.{" "}
          </p>{" "}
        </div>{" "}
        {/* Error */}{" "}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            {" "}
            <p className="text-red-600">{error}</p>{" "}
          </div>
        )}{" "}
        {/* Success */}{" "}
        {success && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            {" "}
            <p className="text-green-600">{success}</p>{" "}
          </div>
        )}{" "}
        {/* Profile Form */}{" "}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {" "}
          {/* Full Name */}{" "}
          <div>
            {" "}
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {" "}
              Full Name{" "}
            </label>{" "}
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />{" "}
          </div>{" "}
          {/* Email */}{" "}
          <div>
            {" "}
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {" "}
              Email{" "}
            </label>{" "}
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
            />{" "}
            <p className="mt-2 text-xs text-gray-500">
              {" "}
              Email cannot be changed.{" "}
            </p>{" "}
          </div>{" "}
          {/* Profile Picture */}{" "}
          <div>
            {" "}
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {" "}
              Profile Picture URL{" "}
            </label>{" "}
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />{" "}
            <p className="mt-2 text-xs text-gray-500">
              {" "}
              Paste an image URL for your profile picture.{" "}
            </p>{" "}
          </div>{" "}
          {/* Buttons */}{" "}
          <div className="flex flex-wrap gap-3 border-t pt-6">
            {" "}
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {" "}
              {isLoading ? "Updating..." : "Update Profile"}{" "}
            </button>{" "}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {" "}
              Cancel{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </main>
  );
}
