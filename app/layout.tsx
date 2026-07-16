import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
  title: "SAA 2025 — ROOT FURTHER",
  description: "Sun* Annual Awards 2025 — sign in to begin.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Locale is resolved from the NEXT_LOCALE cookie by i18n/request.ts (defaults to
  // "vi" per BR-006). Read here so <html lang> reflects the active locale.
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#00101A]">
        {/*
          Global app background (matches the `/` prelaunch page): the colorful
          organic-root key visual, fixed behind every route, under a strong dark
          overlay so content stays legible on the long content pages. Hero
          sections that layer their own key visual simply sit on top of this.
        */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          <Image src="/assets/home/keyvisual-bg.png" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-[#00101A]/88" />
        </div>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
