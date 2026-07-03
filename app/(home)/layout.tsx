import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./_components/query-provider";
import { Toaster } from "./_components/ui/toaster";
import CONFIG from "@root/config";

export const metadata: Metadata = {
  title: "ShopSphere — Discover Your Perfect Style",
  description: "Your one-stop destination for premium products. Shop electronics, fashion, home & living, sports, beauty and more with exclusive deals.",
  keywords: ["ecommerce", "online shopping", "electronics", "fashion", "home", "deals"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={CONFIG.DEFAULT_THEME}
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}