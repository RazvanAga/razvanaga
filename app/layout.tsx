import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Razvan Aga — Fullstack Engineer",
  description: "Fullstack engineer based in Timișoara.",
  openGraph: {
    title: "Razvan Aga — Fullstack Engineer",
    description: "Fullstack engineer based in Timișoara.",
    url: "https://razvanaga.com",
    siteName: "Razvan Aga",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${sourceSerif4.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
