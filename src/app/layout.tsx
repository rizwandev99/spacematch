import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TRPCProvider } from "@/trpc/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "spacematch",
  description: "AI-powered office space finder for startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TRPCProvider>
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}
