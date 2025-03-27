import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Roboto_Mono } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeProvider"; // Import the provider

const roboto_Mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page Plaza",
  description:
    "This is an e-commerce platform where you can buy or sell used books.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      {/* Force dark mode for testing */}
      <body className={roboto_Mono.className}>
        <ThemeProvider>
          {/* Wrap the whole app with ThemeProvider */}
          <LayoutWrapper>
            <Header />
            {children}
            <Toaster />
            <Footer />
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
