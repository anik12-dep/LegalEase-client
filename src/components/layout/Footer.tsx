import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-10 bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">LegalEase</h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
              Connect with experienced legal professionals and find the right
              legal counsel for your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold  ml-20 text-gray-900">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 ml-20 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                About
              </Link>

              <Link href="/" className="hover:text-blue-600">
                Contact
              </Link>

              <Link href="/" className="hover:text-blue-600">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Stay Connected
            </h3>

            <p className="mt-3 text-sm text-gray-600">
              Subscribe to receive updates from LegalEase.
            </p>

            {/* Newsletter */}
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <button
                type="button"
                className="rounded-r-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-blue-600 hover:text-white"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-blue-600 hover:text-white"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2026 LegalEase. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
