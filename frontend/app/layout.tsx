import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Axon - Purchase Order System",
  description: "Enterprise Purchase Order Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#2a3439",
              border: "1px solid rgba(42,52,57,0.1)",
              boxShadow: "0 4px 20px rgba(42,52,57,0.08)",
              borderRadius: "12px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
