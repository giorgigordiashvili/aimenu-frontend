import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Georgian } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { TableProvider } from "@/context/TableContext";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className={`${inter.variable} ${notoSansGeorgian.variable}`}>
      <body>
        <TableProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </TableProvider>
      </body>
    </html>
  );
}
