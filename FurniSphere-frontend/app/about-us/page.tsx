import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Our 3D Furniture Store</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="mb-4">
            Welcome to FutureFurnish, your premier destination for cutting-edge
            3D furniture! We are passionate about bringing the future of
            interior design right into your home.
          </p>
          <p className="mb-4">
            Founded in 2023, FutureFurnish has quickly become a leader in the 3D
            furniture industry. Our team of expert designers and tech
            enthusiasts work tirelessly to create stunning, customizable 3D
            furniture pieces that blend seamlessly with both virtual and
            physical spaces.
          </p>
          <p className="mb-4">
            At FutureFurnish, we believe in the power of technology to transform
            living spaces. Our innovative 3D furniture allows you to visualize
            and customize your dream interiors like never before. Whether you're
            designing for virtual reality, augmented reality, or planning a
            real-world renovation, our products offer unparalleled flexibility
            and style.
          </p>
          <p>
            We're committed to sustainability and pushing the boundaries of
            what's possible in furniture design. Join us in shaping the future
            of home decor with FutureFurnish!
          </p>
        </div>
        <div className="relative h-64 md:h-auto">
          <Image
            src="/static/images/heroImage.png"
            alt="3D Furniture Showroom"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
