"use client";

import React from "react";
import Link from "next/link";
import { motion, easeOut, type Transition, type TargetAndTransition } from "framer-motion";

const ReveLanding: React.FC = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut } as Transition,
    },
  };

  // Type-safe motion animation for image
  const getFloatingMotion = (
    duration: number
  ): {
    animate: TargetAndTransition;
    transition: Transition;
  } => ({
    animate: {
      y: ["100vh", "-10vh"],
      rotate: [0, 360],
      opacity: [0, 1, 0],
    },
    transition: {
      duration,
      repeat: Infinity,
      repeatType: "loop" as const, // type-safe literal
      ease: "easeInOut",
    },
  });

  const bg1 = getFloatingMotion(12); // slower
  const bg2 = getFloatingMotion(8); // faster

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 text-center space-y-8 overflow-hidden">
      {/* Floating Image 1 (slow) */}
    
      {/* Heading */}
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Meet <span className="text-purple-400">Reve Image</span>{" "}
          <span className="text-gray-400">1.0</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          A new AI model trained from the ground up to excel at{" "}
          <span className="text-gray-300">prompt adherence</span>,{" "}
          <span className="text-gray-300">aesthetics</span>, and{" "}
          <span className="text-gray-300">typography</span>. Sign up to experience
          a preview and stay in the loop on{" "}
          <span className="text-gray-300">future releases</span> from Reve.
        </p>
        <Link href="/create">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-md font-medium hover:opacity-90">
            Go to app
          </button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-5 flex items-center space-x-6 text-sm text-gray-400"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.5 }}
      >
        <Link href="/privacypolicy">Privacy Policy</Link>
        <Link href="/termspage">Terms & Conditions</Link>
        <Link href="/contact">Contact Us</Link>
      </motion.div>
    </section>
  );
};

export default ReveLanding;
