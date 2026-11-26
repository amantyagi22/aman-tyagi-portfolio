import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

/* Geist everywhere: pulled tight for display, plain for text */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // sub-pages set a bare title ("Work") and the template adds the name
  title: {
    default: "Aman Tyagi - AI & Backend Engineer",
    template: "%s - Aman Tyagi",
  },
  description:
    "Senior software engineer building production RAG, LLM agents and multi-tenant backends on Node.js, Python and AWS.",
  metadataBase: new URL("https://www.amantyagi.me"),
  openGraph: {
    title: "Aman Tyagi - AI & Backend Engineer",
    description:
      "Production RAG, LLM agents and multi-tenant backends on Node.js, Python and AWS.",
    url: "https://www.amantyagi.me",
    siteName: "Aman Tyagi",
    type: "website",
  },
  // no title or description: cards fall back to each page's og: tags
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
