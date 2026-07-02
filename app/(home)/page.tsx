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
import { StickyCategoryNav, CategoryNavSentinel } from './_components/ecommerce/sticky-category-nav';
import { PageSkeleton } from './_components/ecommerce/page-skeleton';
import { ImageComparison } from './_components/ecommerce/image-comparison';
import { ProductBundles } from './_components/ecommerce/product-bundles';
import { StockAlert } from './_components/ecommerce/stock-alert';
import { ProductQuickStats } from './_components/ecommerce/product-quick-stats';
import { ProductCatalog } from './_components/ecommerce/product-catalog';
import { I18nProvider } from './i18n/provider';
import { useCompareStore } from './_lib/store';
import { useScrollReveal } from './_hooks/use-scroll-reveal';
import { Header } from './_components/ecommerce/header';

export default function Home() {
  const scrollRef = useScrollReveal();
  const isCompareOpen = useCompareStore((s) => s.isCompareOpen);
  const setCompareOpen = useCompareStore((s) => s.setCompareOpen);

  return (
    <I18nProvider>
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0" ref={scrollRef}>
      <ScrollProgress />
      <WelcomeToast />
      <Header />
      {/* <StickyCategoryNav /> */}
      <main className="flex-1">
        <HeroSection />
        <WaveDivider variant="subtle" color="#E63946" />
        <BrandMarquee />
        <CategoryNavSentinel />
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
      <CartDrawer />
      <QuickViewModal />
      <BackToTop />
      <MobileBottomNav />
      <FlyToCart />
      <CompareBar />
      <CompareDrawer open={isCompareOpen} onClose={() => setCompareOpen(false)} />
      <CookieBanner />
      <StockAlert />
      <ProductQuickStats />
      <ProductCatalog />
    </div>
    </I18nProvider>
  );
}