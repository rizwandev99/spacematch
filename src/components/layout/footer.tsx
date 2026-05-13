import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              space<span className="text-blue-600">match</span>
            </Link>
            <p className="mt-1 text-xs text-gray-500">
              AI-powered office space finder for startups
            </p>
          </div>

          <nav className="flex gap-6">
            <Link href="/listings" className="text-sm text-gray-500 hover:text-gray-700">
              Browse
            </Link>
            <Link href="/saved" className="text-sm text-gray-500 hover:text-gray-700">
              Saved
            </Link>
            <Link href="/compare" className="text-sm text-gray-500 hover:text-gray-700">
              Compare
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2026 spacematch. Built with Next.js, tRPC, and Drizzle.
          </p>
        </div>
      </div>
    </footer>
  );
}
