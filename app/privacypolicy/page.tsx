'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen  bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-3xl my-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Privacy <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text">Policy</span>
        </h1>

        <p className="text-lg text-gray-300 mb-4">
          Welcome to Reve Image 1.0. This Privacy Policy explains how we collect, use, and protect your information when you use our app.
        </p>

        <div className="space-y-6 text-gray-400 text-sm sm:text-base text-left mt-10">
          <section>
            <h2 className="font-semibold text-white mb-1">1. Information We Collect</h2>
            <p>We may collect personal data such as your name, email address, and usage data to enhance your experience.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">2. How We Use Your Information</h2>
            <p>We use your data to operate and improve our services, provide customer support, and send you relevant updates.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">3. Data Sharing</h2>
            <p>We do not sell your personal data. We may share data with service providers to help operate our services under strict confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">4. Security</h2>
            <p>Your data is protected with industry-standard security measures. However, no method is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">5. Your Rights</h2>
            <p>You may request to view, update, or delete your personal information at any time.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">6. Updates</h2>
            <p>We may update this Privacy Policy. Changes will be posted on this page with a revised effective date.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">7. Contact</h2>
            <p>If you have any questions about this Privacy Policy, contact us at <span className="text-purple-400">support@reve.ai</span>.</p>
          </section>
        </div>

        <div className="mt-12">
          <a href="/" className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded hover:opacity-90 transition">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
