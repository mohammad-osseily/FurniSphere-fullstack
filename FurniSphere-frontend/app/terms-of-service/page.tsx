export default function TermsOfService() {
  const sections = [
    {
      title: "Acceptance of Terms",
      body:
        "By accessing and using this website, you accept and agree to be bound by these Terms. If you do not agree, please discontinue use immediately.",
    },
    {
      title: "Use of Website",
      body:
        "Use the site only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit any other user.",
    },
    {
      title: "Intellectual Property",
      body:
        "All content, design, assets, and compilation on this site are protected by applicable copyrights, trademarks, and other proprietary rights.",
    },
    {
      title: "Disclaimer of Warranties",
      body:
        'Content is provided on an "as is" basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.',
    },
    {
      title: "Limitation of Liability",
      body:
        "We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of this site or any linked site.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white/80 shadow-xl shadow-gray-200/40 backdrop-blur">
          <div className="rounded-t-2xl bg-gradient-to-r from-primary to-indigo-500 px-6 py-8 text-white">
            <p className="text-sm uppercase tracking-[0.2em] opacity-80">
              Legal
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Terms of Service</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90">
              Know your rights, obligations, and the rules for using FurniSphere.
            </p>
          </div>

          <div className="px-6 py-8 space-y-6">
            <div className="grid gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm text-gray-700">
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                Quick highlights
              </div>
              <ul className="grid gap-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Use the platform lawfully and respectfully.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Our content and assets remain protected intellectual property.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Service is provided as-is; liability is limited.
                </li>
              </ul>
            </div>

            <div className="grid gap-4">
              {sections.map((section, idx) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {idx + 1}. {section.title}
                    </h2>
                    <span className="text-xs text-gray-400">Updated</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm text-primary">
              Questions about these terms? Contact support and reference
              “Terms of Service” in your subject line.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
