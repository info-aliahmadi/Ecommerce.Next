'use client';

import { HeroSection } from './_components/ecommerce/hero';
import { BrandMarquee } from './_components/ecommerce/brand-marquee';
import { FeaturedCategories } from './_components/ecommerce/featured-categories';
import { FeaturedProducts } from './_components/ecommerce/featured-products';
import { DealsSection } from './_components/ecommerce/deals-section';
import { TestimonialsSection } from './_components/ecommerce/testimonials';
import { RecentlyViewed } from './_components/ecommerce/recently-viewed';
import { ProductGrid } from './_components/ecommerce/product-grid';
import { NewsletterSection } from './_components/ecommerce/newsletter';
import { Footer } from './_components/ecommerce/footer';
import { CartDrawer } from './_components/ecommerce/cart-drawer';
import { QuickViewModal } from './_components/ecommerce/quick-view-modal';
import { BackToTop } from './_components/ecommerce/back-to-top';
import { MobileBottomNav } from './_components/ecommerce/mobile-bottom-nav';
import { WaveDivider } from './_components/ecommerce/wave-divider';
import { ScrollProgress } from './_components/ecommerce/scroll-progress';
import { FlyToCart } from './_components/ecommerce/fly-to-cart';
import { CompareBar } from './_components/ecommerce/compare-bar';
import { CompareDrawer } from './_components/ecommerce/compare-drawer';
import { WelcomeToast } from './_components/ecommerce/welcome-toast';
import { TrustSection } from './_components/ecommerce/trust-section';
import { TrendingCarousel } from './_components/ecommerce/trending-carousel';
import { DealTicker } from './_components/ecommerce/deal-ticker';
import { CookieBanner } from './_components/ecommerce/cookie-banner';
import { ShopTheLook } from './_components/ecommerce/shop-the-look';
import { ImageComparison } from './_components/ecommerce/image-comparison';
import { ProductBundles } from './_components/ecommerce/product-bundles';
import { StockAlert } from './_components/ecommerce/stock-alert';
import { ProductQuickStats } from './_components/ecommerce/product-quick-stats';
import { useScrollReveal } from './_hooks/use-scroll-reveal';
import { Header } from './_components/ecommerce/header';
import LoginPopup from './_components/pages/login-popup';
import RegisterPopup from './_components/pages/register-popup';

/* ─── Shared overlays (cart, quick-view, etc.) ──────────────── */
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

/* ─── Home page ─────────────────────────────────────────────── */
function HomePage() {
  const scrollRef = useScrollReveal();
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0" ref={scrollRef}>
      <ScrollProgress />
      <WelcomeToast />
      <Header />
      {/* <StickyCategoryNav /> */}
      <main className="flex-1">
        <HeroSection />
        <WaveDivider variant="subtle" color="#E63946" />
        <BrandMarquee />
        {/* <CategoryNavSentinel /> */}
        <FeaturedCategories />
        <WaveDivider variant="gradient" color="#6A5ACD" />
        <ImageComparison />
        <FeaturedProducts />
        <TrendingCarousel />
        <ShopTheLook />
        <ProductBundles />
        <DealsSection />
        <DealTicker />
        <WaveDivider variant="subtle" flip color="#20B2AA" />
        <TestimonialsSection />
        <WaveDivider variant="gradient" flip color="#FF69B4" />
        <TrustSection />
        <RecentlyViewed />
        <WaveDivider variant="default" color="#FFC107" />
        <ProductGrid />
        <NewsletterSection />
      </main>
      <Footer />
      <SharedOverlays />
      <StockAlert />
      <ProductQuickStats />
      {/* <ProductCatalog /> */}
    </div>
  );
}

/* ─── Inner page shell (header + main + footer + overlays) ──── */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <ScrollProgress />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <SharedOverlays />
    </div>
  );
}

/* ─── Client-side page router ───────────────────────────────── */
function PageRouter() {
  return (
    <HomePage />
  );
}

export default function Home() {
  return (
    <PageRouter />
  );
}