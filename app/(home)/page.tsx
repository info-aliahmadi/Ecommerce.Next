'use client';

import { Header } from '@/components/ecommerce/header';
import { HeroSection } from '@/components/ecommerce/hero';
import { BrandMarquee } from '@/components/ecommerce/brand-marquee';
import { FeaturedCategories } from '@/components/ecommerce/featured-categories';
import { FeaturedProducts } from '@/components/ecommerce/featured-products';
import { DealsSection } from '@/components/ecommerce/deals-section';
import { TestimonialsSection } from '@/components/ecommerce/testimonials';
import { RecentlyViewed } from '@/components/ecommerce/recently-viewed';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { NewsletterSection } from '@/components/ecommerce/newsletter';
import { Footer } from '@/components/ecommerce/footer';
import { CartDrawer } from '@/components/ecommerce/cart-drawer';
import { QuickViewModal } from '@/components/ecommerce/quick-view-modal';
import { BackToTop } from '@/components/ecommerce/back-to-top';
import { MobileBottomNav } from '@/components/ecommerce/mobile-bottom-nav';
import { WaveDivider } from '@/components/ecommerce/wave-divider';
import { ScrollProgress } from '@/components/ecommerce/scroll-progress';
import { FlyToCart } from '@/components/ecommerce/fly-to-cart';
import { CompareBar } from '@/components/ecommerce/compare-bar';
import { CompareDrawer } from '@/components/ecommerce/compare-drawer';
import { WelcomeToast } from '@/components/ecommerce/welcome-toast';
import { TrustSection } from '@/components/ecommerce/trust-section';
import { TrendingCarousel } from '@/components/ecommerce/trending-carousel';
import { DealTicker } from '@/components/ecommerce/deal-ticker';
import { CookieBanner } from '@/components/ecommerce/cookie-banner';
import { ShopTheLook } from '@/components/ecommerce/shop-the-look';
import { StickyCategoryNav, CategoryNavSentinel } from '@/components/ecommerce/sticky-category-nav';
import { PageSkeleton } from '@/components/ecommerce/page-skeleton';
import { ImageComparison } from '@/components/ecommerce/image-comparison';
import { ProductBundles } from '@/components/ecommerce/product-bundles';
import { StockAlert } from '@/components/ecommerce/stock-alert';
import { ProductQuickStats } from '@/components/ecommerce/product-quick-stats';
import { useCompareStore } from '@/lib/store';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export default function Home() {
  const scrollRef = useScrollReveal();
  const isCompareOpen = useCompareStore((s) => s.isCompareOpen);
  const setCompareOpen = useCompareStore((s) => s.setCompareOpen);

  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0" ref={scrollRef}>
      <ScrollProgress />
      <WelcomeToast />
      <Header />
      <StickyCategoryNav />
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
    </div>
  );
}