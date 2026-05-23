import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aman Tyagi — Backend Engineer",
  description:
    "Backend engineer building scalable systems, performance-critical infrastructure, and automation platforms.",
  metadataBase: new URL("https://amantyagi.dev"),
  openGraph: {
    title: "Aman Tyagi — Backend Engineer",
    description:
      "Scalable backend systems, distributed workers, and automation with Node.js and cloud technologies.",
    url: "https://amantyagi.dev",
    siteName: "Aman Tyagi",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aman Tyagi — Backend Engineer",
    description:
      "Scalable backend systems, distributed workers, and automation with Node.js and cloud technologies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full font-sans tracking-[-0.01em]">
        <div className="page-noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
