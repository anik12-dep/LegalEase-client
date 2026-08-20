"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="font-semibold uppercase tracking-wider text-blue-600">
            Contact Us
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Get in Touch with LegalEase
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Have a question or need assistance? Send us a message and our team
            will be happy to help.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h2>

            <div className="mt-6 space-y-5 text-gray-600">
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="mt-1">support@legalease.com</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p className="mt-1">+880 1XXX-XXXXXX</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Location</p>
                <p className="mt-1">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  placeholder="Write your message..."
                  rows={5}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Send Message
              </button>

              {submitted && (
                <p className="rounded-md bg-green-50 p-3 text-center text-sm text-green-600">
                  Thank you! Your message has been received.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
