'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Alert, Snackbar } from '@mui/material';

import HeroBanner from './_components/hero/HeroBanner';
import CategoryCard from './_components/category/CategoryCard';
import ProductGrid from './_components/product/ProductGrid';
import PromoBanner from './_components/layout/PromoBanner';
import NewsletterSection from './_components/newsletter/NewsletterSection';
import { ProductGridSkeleton, CategoryGridSkeleton } from './_components/layout/LoadingSkeleton';

import HomeProductService from './_services/HomePageService';

export default function HomePage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const productService = new HomeProductService();

      setLoadingCategories(true);
      const categoriesResult = await productService.getAllCategories();
      if (categoriesResult.succeeded) {
        setCategories(categoriesResult.data || []);
      }
      setLoadingCategories(false);

      setLoadingProducts(true);
      
      const [featuredResult, bestSellersResult, latestResult] = await Promise.all([
        productService.getFeaturedProducts(),
        productService.getBestSellingProducts(),
        productService.getLatestProducts(),
      ]);

      if (featuredResult.succeeded) {
        setFeaturedProducts(featuredResult.data || []);
      }

      if (bestSellersResult.succeeded) {
        setBestSellers(bestSellersResult.data || []);
      }

      if (latestResult.succeeded) {
        setLatestProducts(latestResult.data || []);
      }


      setLoadingProducts(false);
    } catch (error) {
      console.error('Failed to load homepage data:', error);
      setError('Failed to load some content. Please refresh the page.');
      setLoadingCategories(false);
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product: any) => {
    setSnackbar({
      open: true,
      message: `${product.name} added to cart!`,
    });
  };

  const handleAddToWishlist = (product: any) => {
    setSnackbar({
      open: true,
      message: `${product.name} added to wishlist!`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="xl" className="py-8">
        <section className="mb-16">
          <HeroBanner />
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Shop by Category</h2>
              <p className="text-gray-600">Browse our wide range of product categories</p>
            </div>
            <button
              onClick={() => router.push('/categories')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All →
            </button>
          </div>
          
          {loadingCategories ? (
            <CategoryGridSkeleton count={6} />
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No categories available</p>
            </div>
          )}
        </section>

        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
                <p className="text-gray-600">Hand-picked products just for you</p>
              </div>
              <button
                onClick={() => router.push('/products?filter=featured')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All →
              </button>
            </div>
            
            {loadingProducts ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <ProductGrid
                products={featuredProducts}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            )}
          </section>
        )}

        {bestSellers.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Best Sellers</h2>
                <p className="text-gray-600">Most popular products loved by customers</p>
              </div>
              <button
                onClick={() => router.push('/products?filter=bestsellers')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All →
              </button>
            </div>
            
            {loadingProducts ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <ProductGrid
                products={bestSellers}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            )}
          </section>
        )}

        {latestProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">New Arrivals</h2>
                <p className="text-gray-600">Check out our latest products</p>
              </div>
              <button
                onClick={() => router.push('/products?filter=new')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All →
              </button>
            </div>
            
            {loadingProducts ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <ProductGrid
                products={latestProducts}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            )}
          </section>
        )}

        <section className="mb-16">
          <PromoBanner
            type="trending"
            title="Trending Now!"
            description="Discover what's hot and trending. Join thousands of happy customers."
            buttonText="Explore Trends"
            buttonLink="/products?filter=trending"
          />
        </section>

        <section className="mb-8">
          <NewsletterSection />
        </section>
      </Container>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} className="fixed bottom-4 right-4 z-50">
          {error}
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </div>
  );
}
