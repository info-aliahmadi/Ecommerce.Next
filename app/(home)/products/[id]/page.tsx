import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import CONFIG from '@root/config';
import ProductDisplayModel from '../../_types/ProductDisplayModel';
import { GetImage } from '../../_lib/utils';

// Client components (only for interactive parts)
import ImageGallery from './_components/ImageGallery';
import ProductPurchaseSection from './_components/ProductPurchaseSection';
import ReviewForm from './_components/ReviewForm';
import ReviewSummary from './_components/ReviewSummary';
import { Header } from '../../_components/ecommerce/header';
import { Footer } from '../../_components/ecommerce/footer';
import { CartDrawer } from '../../_components/ecommerce/cart-drawer';
import { QuickViewModal } from '../../_components/ecommerce/quick-view-modal';
import { BackToTop } from '../../_components/ecommerce/back-to-top';
import { CompareBar } from '../../_components/ecommerce/compare-bar';
import { CompareDrawer } from '../../_components/ecommerce/compare-drawer';
import { FlyToCart } from '../../_components/ecommerce/fly-to-cart';
import { MobileBottomNav } from '../../_components/ecommerce/mobile-bottom-nav';
import { Badge } from '../../_components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../_components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../_components/ui/breadcrumb';
import {
  Truck,
  RotateCcw,
  Shield,
  Headphones,
  Award,
  Star,
  Calendar,
} from 'lucide-react';
import DeliveryDateType from '@root/app/types/enums/DeliveryDateType';

// ── Server-side data fetch ─────────────────────────────
async function getProduct(id: number): Promise<ProductDisplayModel | null> {
  try {
    const locale = await getLocale();
    const response = await fetch(
      `${CONFIG.API_BASEPATH}/Product/GetProduct?productId=${id}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': locale,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) return null;

    const result = await response.json();
    if (!result.succeeded) return null;

    return result.data;
  } catch {
    return null;
  }
}

// ── Dynamic metadata ──────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(Number(id));

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const imageUrl = product.imagePaths?.[0]
    ? `${CONFIG.API_BASEPATH}${product.imagePaths[0]}`
    : CONFIG.UNKNOWN_IMAGE_BASEPATH;

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || '',
    keywords: product.metaKeywords || '',
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription || '',
      type: 'website',
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription || '',
    },
  };
}

// ── Page component (Server Component) ─────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(Number(id));

  if (!product) {
    notFound();
  }

  const t = await getTranslations('');
  const now = new Date();

  // Check if product is currently "new" based on date range
  const isMarkAsNew = product.markAsNew && (() => {
    if (product.markAsNewStartDateTimeUtc && new Date(product.markAsNewStartDateTimeUtc) > now) return false;
    if (product.markAsNewEndDateTimeUtc && new Date(product.markAsNewEndDateTimeUtc) < now) return false;
    return true;
  })();

  // Build image list
  let images: string[] = product.imagePaths || [];
  if (images.length === 0) {
    const base = GetImage(product.imagePreview);
    images = [base];
  }
  const imageList = images.map(x => CONFIG.API_BASEPATH + x);

  // Delivery date label
  const deliveryDateLabels: Record<number, string> = {
    [DeliveryDateType.OneDay]: t('homepage.productDetail.deliveryOneDay'),
    [DeliveryDateType.ThreeDays]: t('homepage.productDetail.deliveryThreeDays'),
    [DeliveryDateType.OneWeek]: t('homepage.productDetail.deliveryOneWeek'),
    [DeliveryDateType.OneMonth]: t('homepage.productDetail.deliveryOneMonth'),
  };

  // Shipping cards data
  const shippingCards = [
    { icon: Calendar, title: t('homepage.productDetail.estimatedDelivery'), desc: product.deliveryDateName || deliveryDateLabels[product.deliveryDateType] || t('homepage.productDetail.deliveryEstimate'), color: 'text-ecommerce-blue' },
    ...(product.isFreeShipping ? [{ icon: Truck, title: t('homepage.productDetail.freeShipping'), desc: t('homepage.productDetail.freeShippingDesc'), color: 'text-ecommerce-emerald' }] : []),
    // { icon: Zap, title: t('homepage.productDetail.expressShipping'), desc: t('homepage.productDetail.expressShippingDesc'), color: 'text-ecommerce-amber' },
    { icon: RotateCcw, title: product.notReturnable ? t('homepage.productDetail.notReturnablePolicy') : t('homepage.productDetail.returnPolicy'), desc: product.notReturnable ? t('homepage.productDetail.notReturnableDesc') : t('homepage.productDetail.returnPolicyDesc'), color: product.notReturnable ? 'text-ecommerce-red' : 'text-ecommerce-purple' },
    { icon: Shield, title: t('homepage.productDetail.secureCheckout'), desc: t('homepage.productDetail.secureCheckoutDesc'), color: 'text-ecommerce-teal' },
    { icon: Award, title: t('homepage.productDetail.warranty'), desc: t('homepage.productDetail.warrantyDesc'), color: 'text-ecommerce-rose' },
    { icon: Headphones, title: t('homepage.productDetail.customerSupport'), desc: t('homepage.productDetail.customerSupportDesc'), color: 'text-ecommerce-blue' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-ecommerce-surface flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Breadcrumb - Server rendered */}
          <Breadcrumb className="mb-4 sm:mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary text-sm">
                  {t('homepage.shopPage.breadcrumbHome')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products" className="text-ecommerce-text-muted hover:text-ecommerce-text-primary text-sm">
                  {t('homepage.shopPage.breadcrumbShop')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {product.categories?.map(category => category && (
                  <BreadcrumbLink key={"bread-" + category.key} href={"/products?categories=" + category.key} className="text-ecommerce-text-muted hover:text-ecommerce-text-primary text-sm">
                    {category.name}
                  </BreadcrumbLink>
                ))}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm text-ecommerce-text-primary font-medium truncate max-w-[200px]">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Main 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
            {/* Left Column - Image Gallery (client for zoom/navigation) */}
            <div className="lg:col-span-3">
              <ImageGallery images={imageList} productName={product.name} />
            </div>

            {/* Right Column - Product Info (server rendered) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Product Name - Server rendered */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-ecommerce-text-primary leading-tight">
                    {product.name}
                  </h1>
                  {isMarkAsNew && (
                    <Badge className="bg-ecommerce-emerald text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {t('homepage.common.newBadge')}
                    </Badge>
                  )}
                </div>

                {/* Rating - Server rendered */}
                <ReviewSummary
                  rating={product.approvedRatingSum}
                  reviewCount={product.approvedTotalReviews}
                ></ReviewSummary>

                {/* Interactive purchase section (price, stock, variants, quantity, actions) */}
                <ProductPurchaseSection product={product} />
              </div>
            </div>
          </div>

          {/* Tabs Section - Server rendered content, client tabs */}
          <div className="mt-10 sm:mt-14">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full sm:w-auto bg-ecommerce-border/30 p-1 rounded-xl h-auto">
                <TabsTrigger
                  value="description"
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-ecommerce-surface data-[state=active]:shadow-sm"
                >
                  {t('homepage.productDetail.description')}
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-ecommerce-surface data-[state=active]:shadow-sm"
                >
                  {t('homepage.productDetail.reviewsTab')} ({product.approvedTotalReviews})
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-ecommerce-surface data-[state=active]:shadow-sm"
                >
                  {t('homepage.productDetail.shippingInfo')}
                </TabsTrigger>
              </TabsList>

              {/* Description Tab - Server rendered */}
              <TabsContent value="description" className="mt-6">
                <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6">
                  <h3 className="text-lg font-semibold text-ecommerce-text-primary mb-4">
                    {t('homepage.productDetail.productDescription')}
                  </h3>
                  {product.fullDescription && (
                    <div
                      className="prose prose-sm max-w-none text-ecommerce-text-secondary leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                    />
                  )}
                  {product.shortDescription && (
                    <div className="mt-6 pt-6 border-t border-ecommerce-border">
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">
                        {t('homepage.productDetail.highlights')}
                      </h4>
                      <div
                        className="text-sm text-ecommerce-text-muted"
                        dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                      />
                    </div>
                  )}
                  {product.adminComment && (
                    <div className="mt-6 pt-6 border-t border-ecommerce-border">
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-3">
                        {t('homepage.productDetail.adminComment')}
                      </h4>
                      <p className="text-sm text-ecommerce-text-muted leading-relaxed">
                        {product.adminComment}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Reviews Tab - Server rendered summary, client form */}
              <TabsContent value="reviews" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Rating Summary - Server rendered */}
                  <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-5xl font-bold text-ecommerce-text-primary">
                      {product.approvedRatingSum.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-0.5 mt-2 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(product.approvedRatingSum)
                              ? 'fill-ecommerce-amber text-ecommerce-amber'
                              : 'text-ecommerce-border'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-ecommerce-text-muted">
                      {t('homepage.productDetail.viewAllReviews', { count: product.approvedTotalReviews })}
                    </p>
                  </div>

                  {/* Rating Breakdown - Server rendered */}
                  <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6">
                    <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-4">
                      {t('homepage.productDetail.rating')} {t('homepage.productDetail.reviewsTab').toLowerCase()}
                    </h4>
                  </div>

                  {/* Write Review - Client form */}
                  <div className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-6">
                    <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-4">
                      {t('homepage.productDetail.writeReview')}
                    </h4>
                    <ReviewForm productId={product.id} />
                  </div>
                </div>
              </TabsContent>

              {/* Shipping Tab - Server rendered */}
              <TabsContent value="shipping" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shippingCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-ecommerce-surface/50 dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border p-5 hover:shadow-md transition-shadow"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-ecommerce-border/30 flex items-center justify-center mb-3 ${card.color}`}>
                        <card.icon size={20} />
                      </div>
                      <h4 className="text-sm font-semibold text-ecommerce-text-primary mb-1">
                        {card.title}
                      </h4>
                      <p className="text-xs text-ecommerce-text-muted leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <BackToTop />
      <CompareBar />
      <CompareDrawer />
      <FlyToCart />
      <MobileBottomNav />
    </div>
  );
}
