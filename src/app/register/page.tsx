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
  FaBriefcase,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaImage,
  FaFileAlt,
} from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",

    specialization: "",
    experience: "",
    consultationFee: "",
    location: "",
    bio: "",
    availability: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Image Select
  // =========================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  // =========================
  // Upload Image to ImgBB
  // =========================
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();

    formData.append("key", apiKey);
    formData.append("image", file);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("ImgBB Error:", data);

      throw new Error("Failed to upload image to ImgBB.");
    }

    return data.data.url;
  };

  // =========================
  // Registration
  // =========================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Lawyer validation
    if (formData.role === "lawyer") {
      if (
        !formData.specialization.trim() ||
        !formData.experience ||
        !formData.consultationFee ||
        !formData.location.trim() ||
        !formData.bio.trim()
      ) {
        setError("Please fill in all lawyer profile fields.");
        return;
      }

      if (!image) {
        setError("Please upload a professional profile image.");
        return;
      }
    }

    try {
      setLoading(true);

      let imageUrl = "";

      // =========================
      // Lawyer Image Upload
      // =========================
      if (formData.role === "lawyer" && image) {
        setImageUploading(true);

        imageUrl = await uploadImageToImgBB(image);

        setImageUploading(false);
      }

      // =========================
      // Register User
      // =========================
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

          // Lawyer information
          specialization:
            formData.role === "lawyer" ? formData.specialization : "",

          experience: formData.role === "lawyer" ? formData.experience : "",

          consultationFee:
            formData.role === "lawyer" ? formData.consultationFee : "",

          location: formData.role === "lawyer" ? formData.location : "",

          image: imageUrl,

          bio: formData.role === "lawyer" ? formData.bio : "",

          availability:
            formData.role === "lawyer" ? formData.availability : true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Save LegalEase JWT
      localStorage.setItem("token", data.token);

      setSuccess("Registration successful!");

      router.push("/");
    } catch (err: unknown) {
      setImageUploading(false);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Google Registration
  // =========================
  const handleGoogleRegister = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/",
      });
    } catch {
      setError("Google registration failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>

          <p className="mt-2 text-sm text-gray-500">
            Join LegalEase and get started today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* =========================
              Full Name
          ========================= */}
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

          {/* =========================
              Email
          ========================= */}
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

          {/* =========================
              Password
          ========================= */}
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
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* =========================
              Confirm Password
          ========================= */}
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
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* =========================
              Role
          ========================= */}
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

          {/* =========================
              LAWYER PROFILE
          ========================= */}
          {formData.role === "lawyer" && (
            <div className="space-y-5 rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Lawyer Professional Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Complete your professional information to create your lawyer
                  listing.
                </p>
              </div>

              {/* Specialization */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Specialization
                </label>

                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="specialization"
                    placeholder="e.g. Criminal Law"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border bg-white py-3 pl-10 pr-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Experience + Fee */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    name="experience"
                    min="0"
                    placeholder="e.g. 10"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border bg-white p-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Consultation Fee ($)
                  </label>

                  <div className="relative">
                    <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="number"
                      name="consultationFee"
                      min="0"
                      placeholder="e.g. 150"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border bg-white py-3 pl-10 pr-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Dhaka"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border bg-white py-3 pl-10 pr-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Profile Image
                </label>

                <div className="relative">
                  <FaImage className="absolute left-3 top-3.5 text-gray-400" />

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="w-full rounded-md border bg-white py-3 pl-10 pr-3 text-sm"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-gray-500">Image Preview</p>

                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Professional Bio
                </label>

                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-3 text-gray-400" />

                  <textarea
                    name="bio"
                    placeholder="Write a short professional summary..."
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-md border bg-white py-3 pl-10 pr-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Availability
                </label>

                <select
                  name="availability"
                  value={formData.availability ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: e.target.value === "true",
                    }))
                  }
                  className="w-full rounded-md border bg-white p-3 outline-none focus:border-blue-500"
                >
                  <option value="true">Available</option>

                  <option value="false">Busy</option>
                </select>
              </div>
            </div>
          )}

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

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {imageUploading
              ? "Uploading Image..."
              : loading
                ? "Registering..."
                : "Create Account"}
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

        {/* Login */}
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
