import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Roboto_Mono } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
import "./globals.css";
import { ThemeProvider } from "next-themes";

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
    <html lang='en' suppressHydrationWarning>
      <body className={roboto_Mono.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>
            <Header />
            {children}
            <Footer />
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
