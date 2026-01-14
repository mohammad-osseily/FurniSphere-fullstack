import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-base-200 py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4 lg:gap-8">
          {/* Information Section */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg sm:text-xl font-bold text-neutral mb-3 sm:mb-4">Information</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/about-us" className="text-sm sm:text-base text-neutral hover:text-primary transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-sm sm:text-base text-neutral hover:text-primary transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm sm:text-base text-neutral hover:text-primary transition-colors duration-200"
                >
                  Terms Of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* News Teller Section */}
          <div className="w-full md:w-2/4">
            <h3 className="text-lg sm:text-xl font-bold text-neutral mb-3 sm:mb-4">News Teller</h3>
            <p className="text-sm sm:text-base text-neutral mb-4 sm:mb-6">
              Subscribe to get notified about product launches, special offers
              and news.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-neutral"
                required
              />
              <button
                type="submit"
                className="px-6 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-base-200 bg-primary rounded-lg hover:bg-primary/90 active:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Follow Us Section */}
          <div className="w-full md:w-1/4 md:text-right">
            <h3 className="text-lg sm:text-xl font-bold text-neutral mb-3 sm:mb-4 md:mb-4">Follow Us</h3>
            <div className="flex md:justify-end gap-4 sm:gap-5">
              <Link href="#" className="text-neutral hover:text-primary transition-colors duration-200" aria-label="Facebook">
                <Facebook className="w-6 h-6 sm:w-7 sm:h-7" />
              </Link>
              <Link href="#" className="text-neutral hover:text-primary transition-colors duration-200" aria-label="Instagram">
                <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
              </Link>
              <Link href="#" className="text-neutral hover:text-primary transition-colors duration-200" aria-label="Twitter">
                <Twitter className="w-6 h-6 sm:w-7 sm:h-7" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
