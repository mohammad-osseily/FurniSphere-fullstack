import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage, logoutUser } from "../services/authServices";
import { ShoppingBag, User, Menu, X } from "lucide-react";
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
                <Link href="/cart" className="relative flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-black hover:text-primary transition-colors duration-300 stroke-[1.5]" />

                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-error text-base-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center justify-center"
                    onClick={toggleDropdown}
                  >
                    <User className="w-6 h-6 text-black hover:text-primary transition-colors duration-300 stroke-[1.5]" />
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