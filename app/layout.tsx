import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Geist Sans + Geist Mono, the pairing the reference layout was designed
   around — Manrope's rounder terminals read softer against the hairlines */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* only used for the marginalia — the asides that point at things */
const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased dark`}
      // the inline script below rewrites this class before React hydrates,
      // which is the intended behaviour, not a mismatch to warn about
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint: corrects the class on <html> so a
            light-mode visitor never sees a flash of dark. Must be blocking
            and inline — a deferred script paints too late. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full font-sans tracking-[-0.01em]">
        {children}
      </body>
    </html>
  );
}
