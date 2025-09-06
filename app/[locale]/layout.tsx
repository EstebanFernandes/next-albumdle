import type { Metadata } from "next";
import { Geist, Geist_Mono,Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/src/components/header";
import { Background } from "@/src/components/background";
import { getAlbums } from "@/src/lib/csv";
import { ThemeProvider } from "next-themes";
import {NextIntlClientProvider} from 'next-intl';
import { Locale, routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
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
  params: { locale: string };
}){
const { locale } = await params;

if(!routing.locales.includes(locale as Locale)){
    notFound()
  }
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body 
        className={`${josefin_Sans.className} antialiased flex flex-col justify-center items-center w-full h-full`}
      >
       <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <Header />
          <Background albums={getAlbums(40)} />
          {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
