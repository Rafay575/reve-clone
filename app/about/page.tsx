"use client";

import React from "react";
import Link from "next/link";
import { Github, Mail, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const AboutPage: React.FC = () => {
  return (
    <>
    <Navbar />
    <section className="min-h-screen bg-black text-white px-6 py-10 space-y-12">
      <div className="space-y-4 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-purple-400">Reve</span> About
        </h1>
        <p className="text-lg leading-relaxed text-gray-300">
          Reve AI, Inc. is an innovative creative tooling start-up based in Palo Alto, California.
          Our passionate team of researchers, designers, and developers crafts tools that empower storytellers, builders, and visionaries.
        </p>
        <p className="text-lg leading-relaxed text-gray-300">
          Our first release, <span className="text-purple-400">Reve Image</span>, is trained from the ground up to excel in
          <span className="text-gray-200"> prompt adherence</span>, <span className="text-gray-200">aesthetics</span>, and <span className="text-gray-200">typography</span>.
          Join us on this journey and stay tuned for more creative breakthroughs from Reve.
        </p>
        <Link href="/contact" className="inline-block mt-4 px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-md border border-gray-700 transition">
          Contact the team
        </Link>
        <div className="flex justify-center space-x-6 mt-4 text-gray-400">
          <a href="#" className="hover:text-white">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-white">
            <Mail className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-white">
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {["Will the model be open sourced?", "Is Reve Image fine-tuned from an open-weight model?", "Will subscriptions be available instead of credits?", "Can I use images I create commercially?", "Is there an API or will there be one?", "Do you offer student discounts?", "Can I disable content filters?", "Can I hide my images from the Explore page?", "I can't log in, what should I do?", "Is there specific info for content creators?"]
            .map((question, idx) => (
              <details key={idx} className="bg-gray-600 border border-gray-500 rounded-md p-4">
                <summary className="cursor-pointer font-medium text-white hover:text-purple-400">
                  {question}
                </summary>
                <p className="text-gray-400 mt-2 text-sm">
                  Answer to "{question}" will go here. You can customize this text per question.
                </p>
              </details>
            ))}
        </div>
      </div>
    </section>
    </>

  );
};

export default AboutPage;
