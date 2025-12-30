import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nunta Kasiia & Razvan",
  description: "29 Martie 2026",
  openGraph: {
    title: "Nunta Kasiia & Razvan",
    description: "29 Martie 2026",
    images: [
      {
        url: "/Images/Thumbnail.jpeg",
        width: 1200,
        height: 630,
        alt: "Kasiia & Razvan",
      },
    ],
    type: "website",
    locale: "ro_RO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nunta Kasiia & Razvan",
    description: "29 Martie 2026",
    images: ["/Images/Thumbnail.jpeg"],
  },
};

export default function KasiiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
