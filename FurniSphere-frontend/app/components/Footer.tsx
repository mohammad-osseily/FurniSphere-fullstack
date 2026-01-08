import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start">
          {/* Information Section */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="font-bold mb-2">Information</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/about-us" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-sm hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm hover:underline"
                >
                  Terms Of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* News Teller Section */}
          <div className="w-full md:w-2/4 mb-4 md:mb-0">
            <h3 className="font-bold mb-2">News Teller</h3>
            <p className="text-sm mb-2">
              Subscribe to get notified about product launches, special offers
              and news.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Follow Us Section */}
          <div className="w-full md:w-1/4 text-right">
            <h3 className="font-bold mb-2 pr-7">Follow Us</h3>
            <div className="flex justify-end gap-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 ">
                <Instagram className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
