import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid gap-6 md:grid-cols-[1.1fr_1.3fr_0.8fr]">
          {/* Brand / Information */}
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">
                FurniSphere
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-1">
                Design in 3D. Build with confidence.
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Visualize, customize, and collaborate on furniture and
                interiors—from concept to install.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <Link
                href="/about-us"
                className="hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact-us"
                className="hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">
              Stay in the loop
            </h3>
            <p className="text-xs text-gray-600">
              Get product drops, 3D tips, and build updates straight to your
              inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[11px] text-gray-500">
              No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* Social */}
          <div className="space-y-3 md:text-right">
            <h3 className="text-base font-semibold text-gray-900">Follow us</h3>
            <p className="text-xs text-gray-600">
              See what we’re building next.
            </p>
            <div className="flex md:justify-end gap-3 sm:gap-4">
              <Link
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-3 text-[11px] text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            © {new Date().getFullYear()} FurniSphere. All rights reserved.
          </span>
          <span className="text-gray-400">Built for immersive 3D design.</span>
        </div>
      </div>
    </footer>
  );
}
