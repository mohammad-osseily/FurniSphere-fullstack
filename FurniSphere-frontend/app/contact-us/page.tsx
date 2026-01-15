"use client";

import { useState, useEffect } from "react";
import { emitToast } from "../lib/toast";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { name, email, message });
    emitToast("Message sent! We'll get back to you soon.", "success");
    setToast({
      show: true,
      message: "Message sent! We'll get back to you soon.",
    });

    // Clear inputs
    setName("");
    setEmail("");
    setMessage("");
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl shadow-gray-200/40 backdrop-blur">
          <div className="bg-gradient-to-r from-primary to-indigo-500 px-6 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-white/80">
              Contact
            </p>
            <h1 className="mt-2 text-3xl font-semibold">We’d love to hear from you</h1>
            <p className="mt-1 text-sm text-white/90">
              Tell us what you need—product help, partnerships, or feedback.
            </p>
          </div>

          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-800">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none"
              >
                Send message
              </button>
            </form>

            <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-700">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Quick help</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Check our FAQs or send us a note—most questions are answered within one business day.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Support</p>
                    <p className="text-xs text-gray-600">help@furnisphere.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Partnerships</p>
                    <p className="text-xs text-gray-600">partners@furnisphere.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Sales</p>
                    <p className="text-xs text-gray-600">sales@furnisphere.com</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-3 text-xs text-primary">
                Prefer a call? Schedule a 15-minute intro and we’ll demo the 3D tools live.
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <div className="fixed bottom-4 right-4 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}
