import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://music-rec-wrapped.vercel.app'),
  title: "Music Rec Wrapped",
  description: "Your year in music sharing - 2016-2025",
  openGraph: {
    title: "Music Rec Wrapped",
    description: "Your year in music sharing - 2016-2025",
    url: "https://music-rec-wrapped.vercel.app",
    siteName: "Music Rec Wrapped",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music Rec Wrapped",
    description: "Your year in music sharing - 2016-2025",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
