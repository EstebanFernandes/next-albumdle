import { Background } from "@/src/components/background";
import { Header } from "@/src/components/header";
import { Locale, routing } from "@/src/i18n/routing";
import { getAlbums, getBackgroundAlbums } from "@/src/lib/gamemode";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Josefin_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "./globals.css";
import { Footer } from "@/src/components/footer";
import { Toaster } from "@/src/components/ui/sonner";
/*
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

*/
const josefin_Sans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Albumdle",
  description: "Guess the album ",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${josefin_Sans.className} antialiased flex flex-col min-h-screen w-full`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <Header />
            <Background albums={await getBackgroundAlbums(40)} />

            {/* Main content grows to push footer down */}
            <main className="flex-grow flex flex-col items-center w-full">
              {children}
            </main>
             <Toaster />
            {/* Footer always at bottom */}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>

  );
}
