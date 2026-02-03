import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/app/lib/trpc/provider";
import { NextIntlClientProvider } from "next-intl";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Better",
  description: "Habit tracking",
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
  },
  appleWebApp: {
    title: "Better",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <NextIntlClientProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
