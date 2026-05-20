import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Sabor Express | Menu digital y pedidos por WhatsApp",
    template: "%s | Sabor Express",
  },
  description:
    "Menu digital profesional con carrito, checkout, pedidos por WhatsApp y panel administrativo para negocios gastronomicos.",
  openGraph: {
    title: "Sabor Express",
    description: "Tu antojo, en camino.",
    type: "website",
    locale: "es_PY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PY" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
