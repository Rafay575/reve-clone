'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-3xl my-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Terms &amp; <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text">Conditions</span>
        </h1>

        <p className="text-lg text-gray-300 mb-4">
          These Terms govern your access to and use of Reve Image 1.0. By using our app, you agree to these terms in full.
        </p>

        <div className="space-y-6 text-gray-400 text-sm sm:text-base text-left mt-10">
          <section>
            <h2 className="font-semibold text-white mb-1">1. Acceptance of Terms</h2>
            <p>By accessing or using Reve Image, you agree to be bound by these Terms. If you do not agree, do not use the app.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">2. Use of the Service</h2>
            <p>You agree to use the app only for lawful purposes and in accordance with all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">3. User Accounts</h2>
            <p>To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">4. Intellectual Property</h2>
            <p>All content, branding, and AI-generated outputs are the property of Reve unless otherwise noted. You may not reproduce or redistribute any content without permission.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">5. Termination</h2>
            <p>We reserve the right to suspend or terminate your access to the app at any time for violations of these Terms.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">6. Limitation of Liability</h2>
            <p>Reve is provided “as is.” We do not guarantee accuracy or availability. We are not liable for any indirect or consequential damages.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">7. Modifications</h2>
            <p>We may revise these Terms at any time. Continued use of the app after changes means you accept the new Terms.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white mb-1">8. Contact</h2>
            <p>For any questions, contact us at <span className="text-purple-400">support@reve.ai</span>.</p>
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