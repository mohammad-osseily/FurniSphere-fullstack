import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral mb-8 sm:mb-12 md:mb-16 text-center">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-8 lg:gap-12">
          {[
            {
              title: "Purchase Securely",
              image: "/static/images/bussnies.jpg",
              alt: "Man using laptop and holding credit card",
              number: 1,
              description:
                "Shop with confidence using our encrypted payment system. Your financial information is always protected.",
            },
            {
              title: "Ships From Warehouse",
              image: "/static/images/ship.jpg",
              alt: "Large warehouse building",
              number: 2,
              description:
                "Our efficient logistics ensure your order is quickly processed and shipped from our state-of-the-art warehouse facilities.",
            },
            {
              title: "Style Your Room",
              image: "/static/images/room.png",
              alt: "Interior decor with plants and lamp",
              number: 3,
              description:
                "Receive your items and transform your space. Our products are designed to enhance any room's aesthetic.",
            },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative mb-6 sm:mb-8 md:mb-4 w-full max-w-full sm:max-w-sm mx-auto">
                <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 rounded-lg overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 transform -translate-x-1/2">
                  <div className="bg-secondary rounded-full p-1.5 sm:p-2">
                    <div className="bg-primary text-base-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral mb-2 sm:mb-3 text-center">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-neutral text-center max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
