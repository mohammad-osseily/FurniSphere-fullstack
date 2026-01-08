"use client";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative bg-hero-bg bg-cover bg-center  bg-no-repeat h-2/5 flex items-center">
      <div className="container mx-auto flex justify-end">
        <div className="w-1/2 bg-secondary bg-opacity-90 p-16 rounded-lg">
          <div className="text-gray-600 mb-2">New Arrival</div>
          <div className="text-5xl font-bold mb-4">
            Discover Our
            <br />
            New 3D Collection
          </div>
          <div className="text-gray-600 mb-8">
            Step into the future with our immersive 3D product collection. View
            products in real-time, rotate and explore every angle. Chat with our
            AI assistant to rearrange 3D objects and customize your virtual
            space to your liking!
          </div>
          <button
            className="px-8 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-colors"
            onClick={() => router.push("/threeD")}
          >
            EXPLORE
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
