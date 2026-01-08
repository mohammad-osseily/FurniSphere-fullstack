import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductCategories from "./components/ProductCategories";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import Recommendations from "./components/Recommendations";

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <Features />
      <Recommendations />
      <ProductCategories />
      <HowItWorks />
      <Footer />
    </div>
  );
}
