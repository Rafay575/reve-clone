import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Make this a local function, not an export!
function UIToaster() {
  return <Toaster richColors position="top-right" theme="dark" />;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Extended metadata for Next.js
export const metadata: Metadata = {
  title: "Tivoa Art – AI Image Generator for High-Quality, Affordable Visuals",
  description:
    "Create stunning, high-quality AI-generated images at the most affordable price. Perfect for commercial use. Fast, simple, copyright-safe. Try now!",
  openGraph: {
    title: "Tivoa Art – Affordable AI Image Generator",
    description:
      "Generate high-resolution, commercial-use AI images for the lowest price. Only on Tivoa.art – your creative partner.",
    url: "https://tivoa.art/",
    type: "website",
    images: [
      {
        url: "https://tivoa.art/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tivoa Art – Affordable AI Image Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tivoa Art – AI Images for Commercial Use",
    description:
      "Create and download high-quality AI images at affordable prices. Commercial use allowed. Start generating with Tivoa.art today!",
    images: ["https://tivoa.art/twitter-image.jpg"],
  },
  keywords: [
    "ai image generator",
    "commercial ai images",
    "high quality ai art",
    "affordable ai image tool",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* For any tags not covered by Next.js metadata API */}
        <meta
          name="keywords"
          content="ai image generator, commercial ai images, high quality ai art, affordable ai image tool"
        />
        {/* OG tags for redundancy/crawlers */}
        <meta
          property="og:title"
          content="Tivoa Art – Affordable AI Image Generator"
        />
        <meta
          property="og:description"
          content="Generate high-resolution, commercial-use AI images for the lowest price. Only on Tivoa.art – your creative partner."
        />
        <meta property="og:url" content="https://tivoa.art/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://tivoa.art/og-image.jpg" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Tivoa Art – AI Images for Commercial Use"
        />
        <meta
          name="twitter:description"
          content="Create and download high-quality AI images affordably. Commercial use allowed. Start generating with Tivoa.art today!"
        />
        <meta
          name="twitter:image"
          content="https://tivoa.art/twitter-image.jpg"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UIToaster />
        {children}
      </body>
    </html>
  );
}
