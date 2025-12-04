import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/context/CartContext";
import { TableProvider } from "@/context/TableContext";
import "./globals.css";

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
    <html lang="ka">
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
