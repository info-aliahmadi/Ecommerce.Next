'use client';

import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '../../_lib/store';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, CreditCard, Truck, Shield, RotateCcw, Send, ArrowUp, Heart, Zap, Tag, Package } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import HomePageService from '../../_services/HomePageService';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';

const FOOTER_LINK_KEYS = ['shop', 'support', 'company'] as const;

function useFooterLinks() {
  return useQuery({
    queryKey: ['footerLinks'],
    queryFn: async () => {
      const service = new HomePageService();
      const results = await Promise.all(
        FOOTER_LINK_KEYS.map((key) => service.getLinksBySectionKey(key))
      );

      const footerLinks: Record<string, { label: string; href: string }[]> = {};

      results.forEach((result, index) => {
        const key = FOOTER_LINK_KEYS[index];
        if (result.succeeded && result.data && result.data.length > 0) {
          footerLinks[key] = result.data
            .sort((a, b) => a.order - b.order)
            .map((link) => ({
              label: link.title,
              href: link.url,
            }));
        }
      });

      return footerLinks;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function Footer() {
  const t = useTranslations();
  const { setSelectedCategory } = useUIStore();
  const [email, setEmail] = useState('');

  const { data: footerLinks } = useFooterLinks();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const service = new HomePageService();
      const result = await service.getAllCategories();
      const items = result.succeeded ? result.data : [];
      return items;
    },
  });

  const handleMiniSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('homepage.newsletter.invalidEmail') || 'Please enter a valid email');
      return;
    }
    try {
      const service = new HomePageService();
      const result = await service.subscribe({ email });
      if (result.succeeded) {
        setEmail('');
        toast.success(t('homepage.newsletter.success'));
      } else {
        toast.error(result.message || t('homepage.newsletter.error'));
      }
    } catch {
      toast.error(t('homepage.newsletter.error'));
    }
  };

  const links = {
    shop: footerLinks?.shop?.length ? footerLinks.shop : [
      { label: t('homepage.footer.allProducts'), href: '#products' },
      { label: t('homepage.footer.newArrivals'), href: '#products' },
      { label: t('homepage.footer.bestSellers'), href: '#products' },
      { label: t('homepage.footer.dealsAndOffers'), href: '#deals' },
      { label: t('homepage.footer.giftCards'), href: '#' },
    ],
    support: footerLinks?.support?.length ? footerLinks.support : [
      { label: t('homepage.footer.helpCenter'), href: '#' },
      { label: t('homepage.footer.shippingInfo'), href: '#' },
      { label: t('homepage.footer.returns'), href: '#' },
      { label: t('homepage.footer.orderTrackingLink'), href: '#' },
      { label: t('homepage.footer.contactUs'), href: '#' },
    ],
    company: footerLinks?.company?.length ? footerLinks.company : [
      { label: t('homepage.footer.aboutUs'), href: '#' },
      { label: t('homepage.footer.careers'), href: '#' },
      { label: t('homepage.footer.press'), href: '#' },
      { label: t('homepage.footer.privacyPolicy'), href: '#' },
      { label: t('homepage.footer.termsOfService'), href: '#' },
    ],
  };

  const socialLinks: Array<{ icon: any; href: string; label: string, color: string }> = [];
  // push into social links if not empty
  if (CONFIG.FACEBOOK_LINK) socialLinks.push({ icon: Facebook, href: CONFIG.FACEBOOK_LINK, label: 'Facebook', color: '#3b5998' });
  if (CONFIG.TWITTER_LINK) socialLinks.push({ icon: Twitter, href: CONFIG.TWITTER_LINK, label: 'Twitter', color: '#1DA1F2' });
  if (CONFIG.INSTAGRAM_LINK) socialLinks.push({ icon: Instagram, href: CONFIG.INSTAGRAM_LINK, label: 'Instagram', color: '#e44840' });
  if (CONFIG.YOUTUBE_LINK) socialLinks.push({ icon: Youtube, href: CONFIG.YOUTUBE_LINK, label: 'YouTube', color: '#ff0000' });
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ecommerce-text-primary text-white dark:bg-[#0A0C14] relative">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-ecommerce-red via-ecommerce-purple to-ecommerce-teal" />

      {/* Payment & Trust */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: CreditCard, title: t('homepage.footer.securePayments'), desc: t('homepage.footer.sslEncryptedCheckout') },
              {
                icon: Truck, title: t('homepage.footer.expressDelivery'),
                desc: t('homepage.footer.freeOnOrders', { amount: CurrencyViewer(CONFIG.FREE_SHIPPING_THRESHOLD, CONFIG.DEFAULT_CURRENCY) })
              },
              { icon: RotateCcw, title: t('homepage.footer.easyReturnsFooter'), desc: t('homepage.footer.returnGuarantee') },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                <item.icon size={20} className="text-ecommerce-amber shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-ecommerce-red flex items-center justify-center shadow-lg shadow-ecommerce-red/20 group-hover:shadow-ecommerce-red/40 transition-shadow">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-ecommerce-red">Hydra</span>Shop
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
              {t('homepage.footer.tagline')}
            </p>

            {/* Mini Newsletter Form */}
            <form onSubmit={handleMiniSubscribe} className="flex gap-2 mb-6 max-w-sm">
              <div className="relative flex-1">
                <Mail size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder={t('homepage.footer.newsletterPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 ps-9 pe-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-ecommerce-red/40 focus:bg-white/[0.08] transition-all"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-ecommerce-red hover:bg-ecommerce-red/90 text-white flex items-center gap-1.5 text-sm font-medium transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <Send size={14} />
              </button>
            </form>

            {/* Categories Quick Links */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">{t('homepage.footer.categoriesTitle')}</p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((cat) => (
                  <button
                type='button'
                    key={cat.key}
                    onClick={() => { setSelectedCategory(cat.key); scrollToTop(); }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white border border-white/[0.04] hover:border-white/10 transition-all duration-200"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5">
              <a href="tel:+1234567890" className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white/80 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone size={12} />
                </div>
                <span className="ltr-input">{CONFIG.CONTACT_PHONE_NUMBER}</span>
              </a>
              <a href="mailto:hello@hydrashop.com" className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white/80 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail size={12} />
                </div>
                <span className="ltr-input">{CONFIG.CONTACT_EMAIL}</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">
                  <MapPin size={12} />
                </div>

                {CONFIG.CONTACT_ADDRESS}
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">{t('homepage.footer.shop')}<span className="w-1 h-1 rounded-full bg-ecommerce-red" /></p>
            <ul className="space-y-2.5">
              {links.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-ecommerce-red hover:translate-x-0.5 transition-all duration-200 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">{t('homepage.footer.support')}<span className="w-1 h-1 rounded-full bg-ecommerce-red" /></p>
            <ul className="space-y-2.5">
              {links.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-ecommerce-red hover:translate-x-0.5 transition-all duration-200 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">{t('homepage.footer.company')}<span className="w-1 h-1 rounded-full bg-ecommerce-red" /></p>
            <ul className="space-y-2.5">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-ecommerce-red hover:translate-x-0.5 transition-all duration-200 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* Left Side */}
            <div className="text-center md:text-start">
              <h3 className="text-lg sm:text-xl font-bold text-white">{t('homepage.footer.appTitle')}</h3>
              <p className="text-sm text-white/50 mt-1.5 max-w-md">{t('homepage.footer.appDesc')}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                {[
                  { icon: Zap, label: t('homepage.footer.fasterCheckout') },
                  { icon: Tag, label: t('homepage.footer.appOnlyDeals') },
                  { icon: Package, label: t('homepage.footer.orderTracking') },
                ].map((feature) => (
                  <span
                    key={feature.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] text-white/60 text-xs font-medium border border-white/[0.04]"
                  >
                    <feature.icon size={12} />
                    {feature.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side — App Badges */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {/* App Store Badge */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.1] transition-colors cursor-pointer">
                <span className="text-2xl" role="img" aria-label="Apple">🍎</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] text-white/50">{t('homepage.footer.downloadOn')}</span>
                  <span className="text-sm font-semibold text-white">{t('homepage.footer.appStore')}</span>
                </div>
              </div>

              {/* Google Play Badge */}
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.1] transition-colors cursor-pointer">
                <span className="text-2xl" role="img" aria-label="Android">🤖</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] text-white/50">{t('homepage.footer.downloadOn')}</span>
                  <span className="text-sm font-semibold text-white">{t('homepage.footer.googlePlay')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-xs text-white/40">
                {t('homepage.footer.copyright')}
              </p>
              <button
                type='button'
                onClick={scrollToTop}
                className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                <ArrowUp size={12} />
                {t('homepage.footer.backToTop')}
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social?.label ?? ''}
                  href={social?.href}
                  aria-label={social?.label}
                  style={{ backgroundColor: social.color }}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-ecommerce-red hover:text-white text-white/40 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 border border-white/[0.04] hover:border-ecommerce-red"
                >
                  <social.icon size={16} className="text-white" />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              {['Visa', 'MC', 'PayPal', 'Apple Pay'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 text-[10px] font-medium text-white/40 bg-white/[0.04] rounded-lg border border-white/[0.04]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
          {/* Made with love */}
          <div className="text-center mt-3">
            <p className="text-[10px] text-white/20 flex items-center justify-center gap-1 ltr-input">
              Made with <Heart size={10} className="text-ecommerce-red/50" /> using <a href="https://github.com/info-aliahmadi/Ecommerce.Next" className="text-ecommerce-red/50 hover:underline">Hydra Ecommerce</a>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
