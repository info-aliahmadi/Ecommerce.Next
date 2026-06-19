'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
      </div>

      {/* Error Alert */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-3 text-red-400 hover:text-red-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{snackbar.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
