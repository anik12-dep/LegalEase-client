import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          LegalEase
        </Link>

        {/* Menu */}
        <ul className="flex items-center gap-6 font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>

          <li>
            <Link href="/browse-lawyers">Browse Lawyers</Link>
          </li>

          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
