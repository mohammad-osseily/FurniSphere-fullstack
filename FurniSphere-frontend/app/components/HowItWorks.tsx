import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="py-8 md:py-16 px-4">
      <div className="w-4/5 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-16">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
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
              <div className="relative mb-6 md:mb-4 w-full max-w-sm mx-auto">
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={400}
                  height={300}
                  layout="responsive"
                  className="rounded-lg"
                />
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                  <div className="bg-secondary rounded-full p-1.5 md:p-2">
                    <div className="bg-primary  text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg  md:text-xl font-semibold mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-60 md:w-3/4 text-center text-sm md:text-base ">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
