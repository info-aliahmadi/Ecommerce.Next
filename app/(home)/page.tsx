'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import CategoryService from '@dashboard/(ecommerce)/_service/CategoryService';
import ProductService from '@dashboard/(ecommerce)/_service/ProductService';
import CategoryModel from '@dashboard/(ecommerce)/_types/Product/CategoryModel';
import ProductModel from '@dashboard/(ecommerce)/_types/Product/ProductModel';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [featuredCategories, setFeaturedCategories] = useState<CategoryModel[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryService = new CategoryService(session?.accessToken ?? '');
        const productService = new ProductService(session?.accessToken ?? '');

        const categoriesResult = await categoryService.getCategoryList();
        if (categoriesResult.succeeded) {
          const homepageCategories = categoriesResult.data?.filter(cat => cat.showOnHomepage) || [];
          setFeaturedCategories(homepageCategories.slice(0, 6));
        }

        const productsResult = await productService.getAllProducts();
        if (productsResult.succeeded) {
          setFeaturedProducts(productsResult.data?.slice(0, 8) || []);
        }
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      }
    };

    loadData();
  }, [session]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 h-[500px] flex items-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Shop</h1>
            <p className="text-xl mb-6">
              Discover our wide range of products at amazing prices. Quality products delivered to your doorstep.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="relative -mt-8 mb-12 z-20">
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push(`/category/${category.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={'https://via.placeholder.com/400x250'}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.fullDescription}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">${product.sellUnitprice.toFixed(2)}</span>
                    <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Special Offer!</h2>
                <p className="text-lg">Get 20% off on all products with code: WELCOME20</p>
              </div>
              <button className="mt-4 md:mt-0 bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">Stay updated with the latest products and special offers.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">My Account</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/orders" className="text-gray-300 hover:text-white transition-colors">Order History</Link></li>
                <li><Link href="/wishlist" className="text-gray-300 hover:text-white transition-colors">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300 mb-4">
                We provide high-quality products at competitive prices, with excellent customer service.
              </p>
              <p className="text-gray-300">
                Email: info@example.com<br />
                Phone: +1 234 567 890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Your E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
