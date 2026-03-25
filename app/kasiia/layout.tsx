import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.razvanaga.com"),
  title: "Nunta Răzvan & Kasiia",
  description: "29 Martie 2026",
  openGraph: {
    title: "Nunta Răzvan & Kasiia",
    description: "29 Martie 2026",
    images: [
      {
        url: "/Images/preview.jpeg",
        width: 1200,
        height: 1200,
        alt: "Răzvan & Kasiia",
      },
    ],
    type: "website",
    locale: "ro_RO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nunta Răzvan & Kasiia",
    description: "29 Martie 2026",
    images: ["/Images/preview.jpeg"],
  },
};

export default function KasiiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
