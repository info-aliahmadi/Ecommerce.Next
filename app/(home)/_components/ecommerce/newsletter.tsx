'use client';

import { Send, Sparkles, Mail, ShieldCheck, CheckCircle2, Hexagon, Triangle, Circle, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const CONFETTI_COLORS = [
  '#E63946', '#FFC107', '#20B2AA', '#6A5ACD', '#FF69B4', '#10B981',
  '#E63946', '#FFC107', '#20B2AA', '#6A5ACD', '#FF69B4', '#10B981',
];

interface ConfettiParticle {
  id: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  width: number;
  height: number;
}

function generateConfetti(): ConfettiParticle[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.7) * 250,
    rotation: Math.random() * 720 - 360,
    scale: 0.5 + Math.random() * 0.5,
    width: 6 + Math.random() * 6,
    height: 4 + Math.random() * 8,
  }));
}

export function NewsletterSection() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [confettiParticles] = useState<ConfettiParticle[]>(generateConfetti);

  const cardRef = useRef<HTMLDivElement>(null);
  const isCardInView = useInView(cardRef, { once: true });

  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmail('');
    setIsSubscribed(true);

    toast.success(t('homepage.newsletter.success'));

    // Revert to form after 3 seconds
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    revertTimerRef.current = setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  }, [email, t]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  const shapes = [
    { Icon: Hexagon, size: 32, className: 'top-4 right-[15%] text-white/10' },
    { Icon: Triangle, size: 24, className: 'top-8 left-[10%] text-white/8' },
    { Icon: Circle, size: 20, className: 'bottom-6 right-[25%] text-white/12' },
    { Icon: Square, size: 18, className: 'bottom-4 left-[20%] text-white/8' },
    { Icon: Hexagon, size: 16, className: 'top-1/2 right-[8%] text-white/10' },
  ];

  const extraShapes = [
    { size: 'w-6 h-6', className: 'top-[20%] right-[35%] bg-ecommerce-red/20 rounded-full' },
    { size: 'w-3 h-3', className: 'bottom-[25%] left-[30%] bg-ecommerce-teal/20 rounded-full' },
    { size: 'w-4 h-4', className: 'top-[40%] left-[5%] bg-ecommerce-amber/15 rounded-full' },
    { size: 'w-2 h-2', className: 'top-[15%] left-[45%] bg-white/15 rounded-full' },
    { size: 'w-5 h-5', className: 'bottom-[15%] right-[15%] bg-ecommerce-purple/15 rounded-full' },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-ecommerce-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl animated-gradient-bg p-8 sm:p-12 ring-1 ring-white/20 glass"
          style={{
            background: 'linear-gradient(-45deg, #6A5ACD, #7C3AED, #8B5CF6, #20B2AA, #6A5ACD)',
            backgroundSize: '400% 400%',
          }}
        >
          {/* Shimmer overlay on the border — plays once on scroll into view */}
          {isCardInView && (
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, ease: 'easeInOut', times: [0, 0.1, 0.6, 1] }}
            >
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s ease-in-out forwards',
                }}
              />
            </motion.div>
          )}

          {/* Extra floating decorative circles/dots */}
          {extraShapes.map((shape, i) => (
            <div key={`extra-${i}`} className={`absolute ${shape.size} ${shape.className} floating-shape pointer-events-none`} style={{animationDelay: `${-i * 1.5}s`}} />
          ))}

          {/* Floating geometric shapes */}
          {shapes.map((shape, i) => (
            <div key={i} className={`absolute ${shape.className} floating-shape`}>
              <shape.Icon size={shape.size} />
            </div>
          ))}

          {/* Animated gradient orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-sm font-medium mb-4 backdrop-blur-sm"
              >
                <Mail size={14} />
                <Sparkles size={14} />
                Exclusive Access
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {t('homepage.newsletter.title')}
              </h2>
              <p className="text-white/70 mt-2 max-w-md mx-auto lg:mx-0 text-sm">
                {t('homepage.newsletter.subtitle')}
              </p>
              {/* Subscriber count with count-up animation */}
              <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
                <div className="relative">
                  {/* Breathing glow around avatar group */}
                  <motion.div
                    className="absolute -inset-1.5 rounded-full bg-white/10 blur-sm"
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="relative flex -space-x-2">
                    {['bg-ecommerce-red', 'bg-ecommerce-amber', 'bg-ecommerce-teal', 'bg-ecommerce-purple'].map((bg, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full ${bg} border-2 border-white/30 flex items-center justify-center`}>
                        <span className="text-[8px] text-white font-bold">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-white/60">
                  {t('homepage.newsletter.subscribers', { count: '15,000' })}
                </span>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-1.5 mt-3 justify-center lg:justify-start">
                <ShieldCheck size={13} className="text-white/40" />
                <span className="text-xs text-white/40">Trusted by 50,000+ shoppers</span>
              </div>
            </div>

            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  /* ===== SUCCESS STATE ===== */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center justify-center py-6 relative"
                  >
                    {/* Confetti burst */}
                    {confettiParticles.map((particle) => (
                      <motion.div
                        key={particle.id}
                        className="absolute rounded-sm"
                        style={{
                          width: particle.width,
                          height: particle.height,
                          backgroundColor: particle.color,
                          top: '50%',
                          left: '50%',
                          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        }}
                        initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0 }}
                        animate={{
                          x: particle.x,
                          y: particle.y,
                          rotate: particle.rotation,
                          opacity: 0,
                          scale: particle.scale,
                        }}
                        transition={{
                          duration: 1.5,
                          ease: 'easeOut',
                        }}
                      />
                    ))}

                    {/* Animated checkmark circle */}
                    <motion.div
                      className="w-16 h-16 rounded-full bg-ecommerce-emerald flex items-center justify-center mb-4 shadow-lg shadow-ecommerce-emerald/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                    >
                      <motion.svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <motion.path
                          d="M7 14.5L11.5 19L21 9"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        />
                      </motion.svg>
                    </motion.div>

                    <motion.h3
                      className="text-xl font-bold text-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      You&apos;re in! 🎉
                    </motion.h3>
                    <motion.p
                      className="text-white/70 text-sm mt-1 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Check your inbox for a 15% discount code
                    </motion.p>
                  </motion.div>
                ) : (
                  /* ===== FORM STATE ===== */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Mail
                          size={16}
                          className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none z-10"
                        />
                        <Input
                          type="email"
                          placeholder={t('homepage.newsletter.placeholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 ps-10 pe-4 bg-white/15 border-white/20 text-white placeholder:text-white/50 rounded-xl focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:border-white/40 backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] focus:scale-[1.01]"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-12 bg-white text-ecommerce-purple hover:bg-white/90 rounded-xl px-6 font-semibold shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:tracking-wide btn-shine"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            {t('homepage.newsletter.subscribe')}
                            <Send size={16} className="ms-2" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* No spam + unsubscribe row */}
                    <div className="flex items-center justify-center gap-1.5 mt-2.5 lg:justify-start">
                      <CheckCircle2 size={12} className="text-white/40" />
                      <span className="text-white/40 text-xs">{t('homepage.newsletter.privacyNote')}</span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}