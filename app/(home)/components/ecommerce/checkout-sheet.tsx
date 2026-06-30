'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import {
  ShoppingCart, CreditCard, Truck, CheckCircle2, ChevronRight, ChevronLeft,
  Shield, Lock, MapPin, Package, ArrowLeft, Sparkles, PartyPopper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Confetti } from './confetti';

const steps = ['Shipping', 'Payment', 'Review'];

export function CheckoutSheet() {
  const { items, isCartOpen, setCartOpen, totalPrice, totalSavings, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const price = totalPrice();
  const savings = totalSavings();
  const shipping = price >= 50 ? 0 : 5.99;
  const tax = price * 0.08;
  const total = price + shipping + tax;

  const startCheckout = () => {
    setCartOpen(false);
    setIsCheckoutOpen(true);
    setStep(0);
    setIsComplete(false);
    setShowConfetti(false);
  };

  const handlePlaceOrder = () => {
    setIsComplete(true);
    setShowConfetti(true);
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setIsComplete(false);
    setShowConfetti(false);
  };

  return (
    <>
      {/* Confetti Animation */}
      <Confetti trigger={showConfetti} />

      {/* Checkout trigger in cart */}
      {isCartOpen && items.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-ecommerce-surface border-t border-ecommerce-border">
          <Button
            onClick={startCheckout}
            className="w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            Proceed to Checkout
            <ChevronRight size={16} />
          </Button>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Lock size={10} /> SSL Encrypted
            </div>
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Shield size={10} /> Secure Payment
            </div>
            <div className="flex items-center gap-1 text-[10px] text-ecommerce-text-muted">
              <Truck size={10} /> Free Shipping $50+
            </div>
          </div>
        </div>
      )}

      {/* Checkout Sheet */}
      <Sheet open={isCheckoutOpen} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-lg p-0 gap-0 overflow-y-auto rounded-none sm:rounded-2xl">
          {!isComplete ? (
            <>
              {/* Header with steps */}
              <div className="sticky top-0 z-10 bg-white dark:bg-ecommerce-surface border-b border-ecommerce-border px-6 py-4">
                <SheetHeader className="sr-only">
                  <SheetTitle>Checkout</SheetTitle>
                </SheetHeader>
                <button onClick={handleClose} className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-ecommerce-surface-hover flex items-center justify-center hover:bg-ecommerce-border transition-colors">
                  <ArrowLeft size={16} />
                </button>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-0">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          i < step ? 'bg-ecommerce-emerald text-white' :
                          i === step ? 'bg-ecommerce-red text-white shadow-md shadow-ecommerce-red/30' :
                          'bg-ecommerce-surface-hover text-ecommerce-text-muted'
                        }`}>
                          {i < step ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium ${
                          i === step ? 'text-ecommerce-red' : 'text-ecommerce-text-muted'
                        }`}>{s}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-12 sm:w-20 h-0.5 mx-2 mb-4 transition-colors duration-300 ${
                          i < step ? 'bg-ecommerce-emerald' : 'bg-ecommerce-border'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {/* Step 1: Shipping */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-bold text-ecommerce-text-primary mb-1">Shipping Information</h3>
                        <p className="text-sm text-ecommerce-text-muted">Enter your delivery address</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">First Name</label>
                          <Input placeholder="John" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">Last Name</label>
                          <Input placeholder="Doe" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">Email Address</label>
                        <Input type="email" placeholder="john@example.com" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">Street Address</label>
                        <Input placeholder="123 Main Street, Apt 4B" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">City</label>
                          <Input placeholder="New York" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">State</label>
                          <Input placeholder="NY" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">ZIP Code</label>
                          <Input placeholder="10001" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">Phone Number</label>
                        <Input type="tel" placeholder="+1 (234) 567-890" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                      </div>

                      <Button onClick={() => setStep(1)} className="w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 mt-2 transition-all hover:scale-[1.01] active:scale-95">
                        Continue to Payment
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setStep(0)} className="p-1 rounded-lg hover:bg-ecommerce-surface-hover transition-colors">
                          <ChevronLeft size={18} />
                        </button>
                        <div>
                          <h3 className="text-lg font-bold text-ecommerce-text-primary mb-1">Payment Method</h3>
                          <p className="text-sm text-ecommerce-text-muted">Choose how you want to pay</p>
                        </div>
                      </div>

                      {/* Payment options */}
                      <div className="space-y-3">
                        {[
                          { name: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
                          { name: 'PayPal', icon: Shield, desc: 'Fast & secure checkout' },
                          { name: 'Cash on Delivery', icon: Truck, desc: 'Pay when you receive' },
                        ].map((method) => (
                          <button
                            key={method.name}
                            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-ecommerce-border hover:border-ecommerce-purple hover:bg-ecommerce-purple/5 transition-all text-left group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-ecommerce-surface-hover group-hover:bg-ecommerce-purple/10 flex items-center justify-center transition-colors">
                              <method.icon size={18} className="text-ecommerce-text-secondary group-hover:text-ecommerce-purple transition-colors" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-ecommerce-text-primary">{method.name}</p>
                              <p className="text-xs text-ecommerce-text-muted">{method.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Card form */}
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">Card Number</label>
                          <Input placeholder="4242 4242 4242 4242" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">Expiry Date</label>
                            <Input placeholder="MM/YY" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-ecommerce-text-secondary mb-1.5 block">CVC</label>
                            <Input placeholder="123" className="h-11 rounded-xl bg-ecommerce-surface-hover border-ecommerce-border" />
                          </div>
                        </div>
                      </div>

                      <Button onClick={() => setStep(2)} className="w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95">
                        Review Order
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  )}

                  {/* Step 3: Review */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setStep(1)} className="p-1 rounded-lg hover:bg-ecommerce-surface-hover transition-colors">
                          <ChevronLeft size={18} />
                        </button>
                        <div>
                          <h3 className="text-lg font-bold text-ecommerce-text-primary mb-1">Order Review</h3>
                          <p className="text-sm text-ecommerce-text-muted">Confirm your order details</p>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-ecommerce-surface-hover">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-ecommerce-text-primary truncate">{item.name}</p>
                              <p className="text-[11px] text-ecommerce-text-muted">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-bold text-ecommerce-text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Order summary */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-ecommerce-text-secondary">Subtotal</span>
                          <span className="font-medium">${price.toFixed(2)}</span>
                        </div>
                        {savings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-ecommerce-emerald">Discount Savings</span>
                            <span className="font-medium text-ecommerce-emerald">-${savings.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-ecommerce-text-secondary">Shipping</span>
                          <span className="font-medium">{shipping === 0 ? <span className="text-ecommerce-emerald">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-ecommerce-text-secondary">Estimated Tax</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-base font-bold text-ecommerce-text-primary">Total</span>
                          <span className="text-xl font-extrabold text-ecommerce-red">${total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Delivery estimate */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-ecommerce-emerald/10 border border-ecommerce-emerald/20">
                        <Package size={18} className="text-ecommerce-emerald shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-ecommerce-emerald">Estimated Delivery: 3-5 Business Days</p>
                          <p className="text-[10px] text-ecommerce-emerald/70">Order confirmation will be sent to your email</p>
                        </div>
                      </div>

                      <Button onClick={handlePlaceOrder} className="w-full h-12 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2 transition-all hover:scale-[1.01] active:scale-95">
                        <Lock size={16} />
                        Place Order — ${total.toFixed(2)}
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            /* Order Success */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-ecommerce-emerald/20 flex items-center justify-center mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <PartyPopper size={36} className="text-ecommerce-emerald" />
                </motion.div>
              </motion.div>
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-extrabold text-ecommerce-text-primary"
              >
                Order Placed!
              </motion.h3>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-ecommerce-text-muted mt-2 max-w-xs"
              >
                Thank you for your purchase! You&apos;ll receive an email confirmation shortly.
              </motion.p>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 px-4 py-3 rounded-xl bg-ecommerce-surface-hover"
              >
                <p className="text-xs text-ecommerce-text-muted">Order Number</p>
                <p className="text-sm font-bold text-ecommerce-text-primary font-mono">SP-{Date.now().toString().slice(-8)}</p>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 flex items-center gap-2 text-ecommerce-emerald"
              >
                <MapPin size={14} />
                <span className="text-sm font-medium">Estimated delivery: 3-5 business days</span>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button onClick={handleClose} className="mt-8 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl px-8 h-11 font-semibold text-sm transition-all hover:scale-105">
                  <Sparkles size={16} className="mr-2" />
                  Continue Shopping
                </Button>
              </motion.div>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}