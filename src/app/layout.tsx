import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "GraphicAI — A drafting machine for engineering students",
  description:
    "Type the problem. Get the projection. GraphicAI calculates rotation matrices and renders first-angle blueprints in the way your professor expects.",
  authors: [{ name: "Arsh Pathan" }],
  icons: {
    icon: [
      { url: "/graphicai-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/graphicai-icon.svg",
    apple: "/graphicai-icon.svg",
  },
  openGraph: {
    title: "GraphicAI — drafted projections from prose",
    description:
      "A drafting atelier for engineering students. Prose in, first-angle plate out.",
    images: ["/graphicai-mark.svg"],
    type: "website",
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
      className={`${fraunces.variable} ${jetbrains.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
