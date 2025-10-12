import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSubmitContactInquiry } from "../../../hooks/useContact";
import { Loader2, Send } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const {
    mutate: submitInquiry,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useSubmitContactInquiry();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields");
 return;
    }
    submitInquiry(formData);
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-14 px-6 rounded-2xl shadow-sm border border-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Send Us a Message
          </h3>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Have a question or need help? Fill out the form below and our team
            will get back to you as soon as possible.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-800/10 px-4 py-2.5 text-gray-900 text-sm transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-800/10 px-4 py-2.5 text-gray-900 text-sm transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-800/10 px-4 py-2.5 text-gray-900 text-sm transition-all"
              placeholder="How can we help you?"
 required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-800/10 px-4 py-2.5 text-gray-900 text-sm transition-all resize-none"
              placeholder="Write your message here..."
              required
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Message
              </>
            )}
          </motion.button>

          {/* Feedback Messages */}
          {isSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-sm mt-4"
            >
              ✅ Your inquiry has been sent successfully!
            </motion.p>
          )}
          {isError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm mt-4"
            >
              ❌ Error sending message: {(error as Error).message}
            </motion.p>
          )}
        </form>
      </motion.div>
    </section>
  );
};
