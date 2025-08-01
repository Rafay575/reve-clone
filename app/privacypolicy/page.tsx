'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

type PolicySection = {
  heading: string;
  text: string;
};

export default function PrivacyPolicyPage() {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await api.get('/admin/privacy-policy');
        setSections(res.data.length ? res.data : [{
          heading: 'Privacy Policy',
          text: 'Welcome to Tivoa Image 1.0. This Privacy Policy explains how we collect, use, and protect your information when you use our app.',
        }]);
      } catch {
        setSections([{
          heading: 'Privacy Policy',
          text: 'Welcome to Tivoa Image 1.0. This Privacy Policy explains how we collect, use, and protect your information when you use our app.',
        }]);
      }
      setIsLoading(false);
    }
    fetchSections();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-3xl my-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Privacy <span className="logo-gradient-text">Policy</span>
        </h1>

        {isLoading ? (
          <div className="py-16 text-gray-400">Loading…</div>
        ) : (
          <div className="space-y-6 text-gray-400 text-sm sm:text-base text-left mt-10">
            {sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="font-semibold text-white mb-1">
                  {idx > 0 && `${idx}. `}{section.heading}
                </h2>
                <p>
                  {/* For "Contact" section, auto-link email */}
                  { section.text}
                </p>
              </section>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link href="/" className="px-5 py-2 logo-gradient-btn rounded hover:opacity-90 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
