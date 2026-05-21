import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TRPCProvider } from "@/trpc/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "spacematch — AI-Powered Office Space Finder",
    template: "%s | spacematch",
  },
  description: "Find your startup's next office space with AI-powered search. Browse verified listings in San Francisco, New York, and Boston.",
  openGraph: {
    title: "spacematch — AI-Powered Office Space Finder",
    description: "Find your startup's next office space with AI-powered search.",
    type: "website",
  },
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
          <Toaster position="bottom-right" />
        </TRPCProvider>
      </body>
    </html>
  );
}
