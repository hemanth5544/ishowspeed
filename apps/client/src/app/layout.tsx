import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ishowspeed.hemanthr.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ISHOWSPEED | Network Speed Dashboard",
    template: "%s | ISHOWSPEED",
  },
  description:
    "A modern network speed dashboard with live download/upload metrics, latency, packet loss, and global ping insights.",
  keywords: [
    "internet speed test",
    "network dashboard",
    "latency test",
    "ping monitor",
    "packet loss",
    "download speed",
    "upload speed",
    "cloudflare speedtest",
    "ISHOWSPEED",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ISHOWSPEED | Network Speed Dashboard",
    description:
      "Track download, upload, jitter, packet loss, and global ping metrics in a modern real-time dashboard.",
    url: "/",
    siteName: "ISHOWSPEED",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ISHOWSPEED | Network Speed Dashboard",
    description:
      "Live speed test metrics with charts, global ping regions, and connection quality insights.",
  },
  robots: {
    index: true,
    follow: true,
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
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
