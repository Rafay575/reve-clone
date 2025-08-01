'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

type TermsSection = {
  heading: string;
  text: string;
};

export default function TermsPage() {
  const [sections, setSections] = useState<TermsSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await api.get('/admin/terms');
        setSections(
          res.data.length
            ? res.data
            : [
                {
                  heading: 'Terms & Conditions',
                  text: 'These Terms govern your access to and use of Tivoa Image 1.0. By using our app, you agree to these terms in full.',
                },
              ]
        );
      } catch {
        setSections([
          {
            heading: 'Terms & Conditions',
            text: 'These Terms govern your access to and use of Tivoa Image 1.0. By using our app, you agree to these terms in full.',
          },
        ]);
      }
      setIsLoading(false);
    }
    fetchSections();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-3xl my-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Terms &amp;{' '}
          <span className="logo-gradient-text">
            Conditions
          </span>
        </h1>

        {isLoading ? (
          <div className="py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            <p className="text-lg text-gray-300 mb-4">
              {sections[0]?.text}
            </p>

            <div className="space-y-6 text-gray-400 text-sm sm:text-base text-left mt-10">
              {sections.slice(1).map((section, idx) => (
                <section key={idx}>
                  <h2 className="font-semibold text-white mb-1">
                    {idx + 1}. {section.heading}
                  </h2>
                  <p>
                    {/* For "Contact" section, highlight email */}
                    {section.heading.toLowerCase().includes('contact') ? (
                      <>
                        {section.text.split('support@tivoa.art')[0]}
                        <span className="logo-gradient-text">support@tivoa.art</span>
                        {section.text.split('support@tivoa.art')[1]}
                      </>
                    ) : (
                      section.text
                    )}
                  </p>
                </section>
              ))}
            </div>
          </>
        )}

        <div className="mt-12">
          <Link
            href="/"
            className="px-5 py-2 logo-gradient-btn rounded hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
