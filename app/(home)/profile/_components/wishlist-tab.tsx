'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, X } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '../../_components/ui/card';
import { Button } from '../../_components/ui/button';
import { ProductCard } from '../../_components/ecommerce/product-card';
import ProductVariantDisplayModel from '../../_types/ProductVariantDisplayModel';
import FileUploadModel from '@root/app/dashboard/(filestorage)/_types/FileUploadModel';
import CategoryDisplayModel from '../../_types/CategoryDisplayModel';
import { staggerContainer, staggerItem } from './types';

export function WishlistTab({
  t,
  items,
  onAddToCart,
  onRemove,
}: Readonly<{
  t: ReturnType<typeof useTranslations>;
  items: {
    id: number;
    name: string;
    variant: ProductVariantDisplayModel;
    image?: FileUploadModel;
    categories: CategoryDisplayModel[];
  }[];
  onAddToCart: (item: typeof items[0]) => void;
  onRemove: (variantId: number) => void;
}>) {
  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.wishlist')}</h2>
        <Card className="bg-ecommerce-surface border-ecommerce-border">
          <CardContent className="py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-ecommerce-rose/10 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-ecommerce-rose" />
            </div>
            <h3 className="font-semibold text-ecommerce-text-primary">{t('homepage.common.noProductsFound')}</h3>
            <p className="text-sm text-ecommerce-text-muted mt-1 max-w-sm">
              {t('homepage.profile.noOrdersDesc')}
            </p>
            <Button asChild className="mt-4 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white">
              <Link href="/">{t('homepage.profile.startShopping')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-ecommerce-text-primary">{t('homepage.profile.wishlist')}</h2>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item, i) => (
          <motion.div key={item.id} variants={staggerItem} className="group relative">
            <ProductCard
              product={{
                id: item.id,
                name: item.name,
                sku: item.variant.sku,
                createUserId: 0,
                imagePreviewId: item.image?.id ?? null,
                imagePreview: item.image,
                metaKeywords: '',
                metaTitle: '',
                metaDescription: '',
                shortDescription: '',
                fullDescription: '',
                deliveryDateType: 0 as any,
                deliveryDateName: '',
                taxCategoryId: null,
                taxCategoryName: '',
                allowedQuantities: false,
                orderMinimumQuantity: 1,
                orderMaximumQuantity: 999,
                currencyType: 0 as any,
                approvedRatingSum: 45,
                notApprovedRatingSum: 0,
                approvedTotalReviews: 10,
                notApprovedTotalReviews: 0,
                hasDiscountsApplied: item.variant.oldSellPrice > 0,
                markAsNew: false,
                notReturnable: false,
                isTaxExempt: false,
                showOnHomepage: false,
                isFreeShipping: false,
                allowCustomerReviews: true,
                disableBuyButton: false,
                disableWishlistButton: false,
                availableForPreOrder: false,
                callForPrice: false,
                createdOnUtc: new Date(),
                updatedOnUtc: null,
                measureType: 0 as any,
                displayStockQuantity: false,
                stockQuantity: item.variant.productInventory.stockQuantity,
                minStockQuantity: 0,
                categories: item.categories,
                manufacturerNames: [],
                attributes: [],
                imagePaths: [],
                variants: [item.variant],
                reviewIds: [],
                relatedProductIds: [],
                productTags: [],
              } as any}
              index={i}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove(item.variant.id);
                toast.success(t('homepage.common.removeFromWishlist'));
              }}
              className="absolute top-2.5 end-2.5 z-20 w-8 h-8 rounded-full bg-white dark:bg-ecommerce-surface shadow-lg flex items-center justify-center text-ecommerce-text-secondary hover:text-ecommerce-red hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              aria-label={t('homepage.common.removeFromWishlist')}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
