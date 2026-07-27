import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./_components/query-provider";
import { SessionProvider } from "./_components/session-provider";
import { Toaster } from "./_components/ui/sonner";
import CONFIG from "@root/config";
import { CartDrawer } from "./_components/ecommerce/cart-drawer";
import { QuickViewModal } from "./_components/ecommerce/quick-view-modal";
import { BackToTop } from "./_components/ecommerce/back-to-top";
import { MobileBottomNav } from "./_components/ecommerce/mobile-bottom-nav";
import { FlyToCart } from "./_components/ecommerce/fly-to-cart";
import { CompareBar } from "./_components/ecommerce/compare-bar";
import { CompareDrawer } from "./_components/ecommerce/compare-drawer";
import { CookieBanner } from "./_components/ecommerce/cookie-banner";
import LoginPopup from "./_components/pages/login-popup";
import RegisterPopup from "./_components/pages/register-popup";
import { resolveThemeMode } from "@root/utils/resolver";
import { Footer } from "./_components/ecommerce/footer";
import { Header } from "./_components/ecommerce/header";

export const metadata: Metadata = {
  title: "HydraShop — Discover Your Perfect Style",
  description: "Your one-stop destination for premium products. Shop electronics, fashion, home & living, sports, beauty and more with exclusive deals.",
  keywords: ["ecommerce", "online shopping", "electronics", "fashion", "home", "deals"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  function SharedOverlays() {
    return (
      <>
        <CartDrawer />
        <QuickViewModal />
        <BackToTop />
        <MobileBottomNav />
        <FlyToCart />
        <CompareBar />
        <CompareDrawer />
        <CookieBanner />
        <LoginPopup />
        <RegisterPopup />
      </>
    );
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={resolveThemeMode(CONFIG.DEFAULT_THEME)}
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <QueryProvider>
        <SessionProvider>
          <Header />
          {children}
          <div className="mt-auto">
            <Footer />
          </div>
          <Toaster position="top-center" />
          <SharedOverlays />
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}