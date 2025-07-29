'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/axios"; // Your axios instance

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side validation
  const isValid = () =>
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.message.trim() !== '' &&
    /\S+@\S+\.\S+/.test(form.email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      toast.error("Please fill all fields with valid information.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent successfully!");
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not send your message.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Have a question, idea, or just want to say hello? We'd love to hear from you. Fill out the form below and we’ll get back to you soon.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#111] p-8 rounded-xl border border-white/10 shadow-lg">
          <div>
            <label htmlFor="name" className="block text-lg mb-2 text-white">Name</label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="bg-black text-white border border-white/30 px-4 py-3 text-base"
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg mb-2 text-white">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-black text-white border border-white/30 px-4 py-3 text-base"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-lg mb-2 text-white">Message</label>
            <Textarea
              id="message"
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={handleChange}
              className="bg-black text-white border border-white/30 px-4 py-3 text-base"
              placeholder="Type your message here..."
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="px-10 py-3 text-lg logo-gradient-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
