"use client";

import React from "react";
import Link from "next/link";
import {
  motion,
  easeOut,
  type Transition,
} from "framer-motion";
import SocialIcons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";

type Props = {
  isAuthed: boolean;
};

const TivoaLanding: React.FC<Props> = ({ isAuthed }) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut } as Transition,
    },
  };

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"signup" | "signin">("signup");

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 text-center space-y-8 overflow-hidden">
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Meet <span className="logo-gradient-text">Tivoa Image</span>{" "}
          <span className="text-gray-400">1.0</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          A new AI model trained from the ground up to excel at{" "}
          <span className="text-gray-300">prompt adherence</span>,{" "}
          <span className="text-gray-300">aesthetics</span>, and{" "}
          <span className="text-gray-300">typography</span>. Sign up to
          experience a preview and stay in the loop on{" "}
          <span className="text-gray-300">future releases</span> from Tivoa.
        </p>

        {isAuthed ? (
          <Link href="/create">
            <Button className="logo-gradient-btn">Go to store</Button>
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Button
              className="logo-gradient-btn"
              onClick={() => {
                setMode("signup");
                setOpen(true);
              }}
            >
              Sign up
            </Button>
            <Button
              onClick={() => {
                setMode("signin");
                setOpen(true);
              }}
            >
              Log in
            </Button>
          </div>
        )}

        <AuthDialog
          open={open}
          onOpenChange={setOpen}
          mode={mode}
          onModeChange={setMode}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-5 text-sm text-gray-400"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.5 }}
      >
        <SocialIcons />
        <div className="flex items-center space-x-6 ">
          <Link href="/privacypolicy">Privacy Policy</Link>
          <Link href="/termspage">Terms & Conditions</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
      </motion.div>
    </section>
  );
};

export default TivoaLanding;
