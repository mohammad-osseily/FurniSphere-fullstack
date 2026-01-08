import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage, logoutUser } from "../services/authServices";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
  </div>
);

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      const storedUser = getUserFromLocalStorage();
      if (storedUser) {
        setUser(storedUser);
        // Assuming you have a function to get cart item count
        // setCartItemCount(getCartItemCountFromLocalStorageOrApi());
      }
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/static/images/logo2.png"
              alt="logo"
              width={100}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex space-x-6">
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/contact-us">Contact Us</NavLink>
            <NavLink href="/about-us">About Us</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <LoadingSpinner />
            ) : user ? (
              <>
                <Link href="/cart" className="relative">
                  <svg
                    className="text-gray-700 text hover:text-primary transition duration-300"
                    width="28"
                    height="28"
                    viewBox="0 0 48 48"
                    fill="black"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 39.5C18.76 39.5 14.5 35.24 14.5 30C14.5 24.76 18.76 20.5 24 20.5C29.24 20.5 33.5 24.76 33.5 30C33.5 35.24 29.24 39.5 24 39.5ZM24 23.5C20.42 23.5 17.5 26.42 17.5 30C17.5 33.58 20.42 36.5 24 36.5C27.58 36.5 30.5 33.58 30.5 30C30.5 26.42 27.58 23.5 24 23.5Z"
                      fill="#021526"
                    />
                    <path
                      d="M22.88 33.08C22.24 33.08 21.6 32.84 21.12 32.34L19.82 31.04C19.24 30.46 19.24 29.5 19.82 28.92C20.4 28.34 21.36 28.34 21.94 28.92L22.9 29.88L26.12 26.92C26.72 26.36 27.68 26.4 28.24 27C28.8 27.6 28.76 28.56 28.16 29.12L24.6 32.4C24.1 32.86 23.48 33.08 22.88 33.08Z"
                      fill="#021526"
                    />
                    <path
                      d="M30 45.5H18C8.76 45.5 7.04 41.2 6.6 37.02L5.1 25.04C4.88 22.88 4.8 19.78 6.9 17.46C8.7 15.46 11.68 14.5 16 14.5H32C36.34 14.5 39.32 15.48 41.1 17.46C43.18 19.78 43.12 22.88 42.9 25L41.4 37.02C40.96 41.2 39.24 45.5 30 45.5ZM16 17.5C12.62 17.5 10.3 18.16 9.12 19.48C8.14 20.56 7.82 22.22 8.08 24.7L9.58 36.68C9.92 39.88 10.8 42.52 18 42.52H30C37.2 42.52 38.08 39.9 38.42 36.72L39.92 24.7C40.18 22.26 39.86 20.6 38.88 19.5C37.7 18.16 35.38 17.5 32 17.5H16Z"
                      fill="#021526"
                    />
                    <path
                      d="M33 17.26C32.18 17.26 31.5 16.58 31.5 15.76V13C31.5 10.9 30.6 8.85999 29.04 7.43999C27.46 5.99999 25.4 5.33999 23.26 5.53999C19.66 5.87999 16.5 9.55999 16.5 13.4V15.34C16.5 16.16 15.82 16.84 15 16.84C14.18 16.84 13.5 16.16 13.5 15.34V13.38C13.5 7.99999 17.84 3.03999 22.98 2.53999C25.98 2.25999 28.86 3.19999 31.06 5.21999C33.24 7.19999 34.5 10.04 34.5 13V15.76C34.5 16.58 33.82 17.26 33 17.26Z"
                      fill="#021526"
                    />
                  </svg>

                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2"
                    onClick={toggleDropdown}
                  >
                    <User className="text-gray-700 hover:text-primary transition duration-300" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-20">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/order-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Order History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-block px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-block px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
            <button
              className="md:hidden text-gray-700 hover:text-primary transition duration-300"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4">
          <div className="container mx-auto px-4 space-y-4">
            <NavLink href="/products" mobile>
              Products
            </NavLink>
            <NavLink href="/contact" mobile>
              Contact Us
            </NavLink>
            <NavLink href="/about" mobile>
              About Us
            </NavLink>
            {!user && (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition duration-300 text-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-300 text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode; mobile?: boolean }> = ({
  href,
  children,
  mobile,
}) => (
  <Link
    href={href}
    className={`text-gray-700 hover:text-primary transition duration-300 ${
      mobile ? "block py-2" : ""
    }`}
  >
    {children}
  </Link>
);

export default Navbar;