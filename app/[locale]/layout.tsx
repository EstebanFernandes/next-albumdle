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
import "../globals.css";
import { Footer } from "@/src/components/footer";
import { Toaster } from "@/src/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/app-sidebar";
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
  const backgroundAlbums = await getBackgroundAlbums(40);
  const left = backgroundAlbums.slice(0, 19)
  const right = backgroundAlbums.slice(20)
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${josefin_Sans.className} antialiased flex h-screen w-screen overflow-hidden`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <SidebarProvider defaultOpen={false}>
              <div className="flex w-full h-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 h-full">
                  <Header />
                  <main className="flex h-full w-full justify-center items-stretch overflow-hidden
                 gap-0 lg:gap-8
                 ">
                    <Background albums={left} forward />
                    <div className="overflow-y-auto h-full w-[100vw] sm:w-[70vw] lg:w-[50vw] md:w-[50vw] shrink-0">
                      {children}
                    </div>
                    <Background albums={right} forward={false} />
                  </main>


                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>

  );
}
