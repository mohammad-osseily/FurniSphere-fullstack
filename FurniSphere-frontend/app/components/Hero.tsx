"use client";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative bg-hero-bg bg-cover bg-center bg-no-repeat min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-end justify-end pt-20 sm:pt-24 md:pt-32 pb-4 sm:pb-6 md:pb-8 lg:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] bg-secondary bg-opacity-90 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">
            <div className="text-neutral text-xs sm:text-sm mb-1.5 font-medium">New Arrival</div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-neutral leading-tight">
              Discover Our
              <br />
              New 3D Collection
            </div>
            <div className="text-neutral text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed">
              Step into the future with our immersive 3D product collection. View
              products in real-time, rotate and explore every angle. Chat with our
              AI assistant to rearrange 3D objects and customize your virtual
              space to your liking!
            </div>
            <button
              className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-primary text-base-200 rounded-xl hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => router.push("/threeD")}
            >
              EXPLORE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
