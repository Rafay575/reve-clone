"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SocialIcons from "@/components/icons";
import { api } from "@/lib/axios";

type AboutSection = { text: string };
type FAQ = { question: string; answer: string };

const AboutPage: React.FC = () => {
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await api.get('/admin/about');
        setAboutSections(res.data.aboutSections || []);
        setFaqs(res.data.faqs || []);
      } catch {
        setAboutSections([
          { text: "Tivoa AI, Inc. is an innovative creative tooling start-up based in Palo Alto, California. Our passionate team of researchers, designers, and developers crafts tools that empower storytellers, builders, and visionaries." },
          { text: "Our first release, Tivoa Image, is trained from the ground up to excel in prompt adherence, aesthetics, and typography. Join us on this journey and stay tuned for more creative breakthroughs from Tivoa." }
        ]);
        setFaqs([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-black text-white px-6 py-10 space-y-12">
        <div className="space-y-4 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold logo-gradient-text">
            Tivoa About
          </h1>
          {loading ? (
            <p className="text-lg text-gray-400">Loading...</p>
          ) : (
            aboutSections.map((section, idx) => (
              <p
                key={idx}
                className="text-lg leading-relaxed text-gray-300"
              >
                {section.text}
              </p>
            ))
          )}

          <Link
            href="/contact"
            className="inline-block logo-gradient-btn mt-4 px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-md border border-gray-700 transition"
          >
            Contact the team
          </Link>
          <div className="flex justify-center space-x-6 mt-4 text-gray-400">
            <SocialIcons />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 logo-gradient-text">
            Frequently Asked Questions
          </h2>
          {loading ? (
            <div className="text-gray-400 text-center py-10">Loading…</div>
          ) : faqs.length === 0 ? (
            <div className="text-gray-400 text-center py-10">No FAQs yet.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </>
  );
};

export default AboutPage;
