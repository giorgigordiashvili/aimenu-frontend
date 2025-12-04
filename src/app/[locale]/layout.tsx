import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Georgian } from "next/font/google";
import { notFound } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { TableProvider } from "@/context/TableContext";
import { LocaleProvider } from "@/context/LocaleContext";
import ClarityProvider from "@/components/ClarityProvider";
import { locales, Locale, isValidLocale } from "@/i18n/config";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-georgian",
});

export const metadata: Metadata = {
  title: "AiMenu - Restaurant Menu",
  description: "Digital menu for restaurants",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} ${notoSansGeorgian.variable}`}>
      <body>
        <ClarityProvider />
        <LocaleProvider locale={locale as Locale}>
          <TableProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </TableProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
