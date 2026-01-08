"use client";

import { useState, useEffect } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your server
    console.log("Form submitted:", { name, email, message });

    // Show success toast
    setToast({
      show: true,
      message: "Message Sent! We'll get back to you soon.",
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
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Send Message
          </button>
        </form>
      </div>
      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}
