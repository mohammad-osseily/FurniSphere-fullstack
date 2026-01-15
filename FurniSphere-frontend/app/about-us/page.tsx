import Image from "next/image";

const highlights = [
  "Immersive 3D visuals to design with confidence.",
  "Customizable pieces that bridge virtual and physical spaces.",
  "Sustainability-minded materials and processes.",
  "Expert support for VR/AR visualizations and real-world builds.",
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="rounded-2xl border border-gray-200 bg-white/80 px-6 py-10 shadow-xl shadow-gray-200/40 backdrop-blur">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">
                About FurniSphere
              </p>
              <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
                Designing the future of furniture in 3D
              </h1>
              <p className="text-sm leading-relaxed text-gray-700">
                FurniSphere blends cutting-edge 3D visualization with thoughtful, sustainable
                design. Plan your spaces in VR/AR, customize every detail, and bring it to life
                in the real world with confidence.
              </p>
              <div className="grid gap-3 text-sm text-gray-800">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <Image
                src="/static/images/heroImage.png"
                alt="FurniSphere showroom"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </header>

        <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white/80 px-6 py-8 shadow-lg shadow-gray-200/40 backdrop-blur md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Our story
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Founded in 2023, FurniSphere grew from a team of designers and technologists
              who wanted interiors to be as interactive and personal as the best digital
              products. We combine 3D, VR/AR, and sustainable fabrication to help you make
              decisions faster and smarter.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              From concept to install, we support designers, homeowners, and teams with
              immersive previews, configurable models, and guidance rooted in real-world
              build experience.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              How we work
            </h2>
            <ul className="grid gap-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>Photoreal 3D previews for confident decision-making.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>Configurable materials, finishes, and dimensions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>Optimized assets for VR/AR and real-world fabrication.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>Support from setup to delivery, with sustainability in mind.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
