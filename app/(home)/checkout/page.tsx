'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ChevronRight, ArrowLeft, Loader2,
} from 'lucide-react';

import { Footer } from '../_components/ecommerce/footer';
import { BackToTop } from '../_components/ecommerce/back-to-top';
import { MobileBottomNav } from '../_components/ecommerce/mobile-bottom-nav';
import { useCartStore, useCheckoutPersistStore } from '../_lib/store';
import { Card, CardContent } from '../_components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../_components/ui/accordion';
import ProfileService from '../_services/ProfileService';
import AccountService from '@root/app/dashboard/(auth)/_service/AccountService';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import { Header } from '../_components/ecommerce/header';

import {
  CheckoutStep,
  ShippingForm,
  PaymentForm,
  VALID_PROMOS,
} from './_components';
import {
  OrderSummary,
  StepProgress,
  ShippingStep,
  PaymentStep,
  ReviewStep,
  ConfirmationStep,
  EmptyCart,
} from './_components';
import ShippingMethod from '@root/app/types/enums/ShippingMethod';
import OrderService from '../_services/OrderService';
import CreateOrderRequest, { CreateOrderItemRequest } from '../_types/Order/CreateOrderRequest';
import PaymentMethod from '@root/app/types/enums/PaymentMethod';

/* ──────────────────────────────────────────────────────────────── */

export default function CheckoutPage() {
  return <CheckoutPageInner />;
}

/* ──────────────────────────────────────────────────────────────── */

function CheckoutPageInner() {
  const t = useTranslations('homepage.paymentPage');
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  const { items, totalPrice, totalSavings, clearCart, totalItems } = useCartStore();
  const checkoutPersist = useCheckoutPersistStore();

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(checkoutPersist.appliedPromo);
  const [promoError, setPromoError] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Order confirmation
  const [orderNumber, setOrderNumber] = useState('');

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<AddressModel[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    checkoutPersist.selectedAddressId ?? 'new'
  );
  const [addressesLoading, setAddressesLoading] = useState(false);


  const getNextAddressTitle = useCallback(() => {
    debugger
    const existingTitles = savedAddresses.map((a) => a.title?.toLowerCase() || '');
    let counter = 1;
    let title: string;
    do {
      title = t('addressTitle', { number: counter });
      counter++;
    } while (existingTitles.includes(title.toLowerCase()));
    return title;
  }, [savedAddresses, t]);

  // Step management
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPlacing, setIsPlacing] = useState(false);

  // Shipping form
  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: '', email: '', phone: '',
    note: checkoutPersist.shippingNote || '',
    address: {
      id: 0,
      userId: 0,
      title: '',
      countryId: 0,
      countryName: '',
      stateProvinceId: 0,
      stateProvinceName: '',
      city: '',
      address1: '',
      zipPostalCode: '',
      phoneNumber: '',
      isDefault: false,
    },
  });

  // Payment form
  const [payment, setPayment] = useState<PaymentForm>({
    method: checkoutPersist.paymentMethod ?? PaymentMethod.CreditCard
  });

  // Address form state
  const [addrForm, setAddrForm] = useState<AddressModel>({
    id: 0,
    userId: 0,
    title: '',
    countryId: 0,
    countryName: '',
    stateProvinceId: 0,
    stateProvinceName: '',
    city: '',
    address1: '',
    zipPostalCode: '',
    phoneNumber: '',
    isDefault: false,
  });

  // Hydrate step from persist store (once)
  const stepHydratedRef = useRef(false);
  useEffect(() => {
    if (stepHydratedRef.current) return;
    stepHydratedRef.current = true;
    const persisted = checkoutPersist.currentStep;
    if (persisted && persisted >= 1 && persisted <= 3) {
      setCurrentStep(persisted);
    }
  }, [checkoutPersist.currentStep]);

  // Pre-fill form with user data (only on initial auth)
  const sessionPrefilledRef = useRef(false);
  useEffect(() => {
    if (sessionPrefilledRef.current) return;
    if (status !== 'authenticated' || !session?.user?.accessToken) return;
    sessionPrefilledRef.current = true;
    const accountService = new AccountService(session.user.accessToken);
    accountService.getCurrentUser().then((user) => {
      setShipping((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
      }));
      setAddrForm((prev) => ({
        ...prev,
        title: getNextAddressTitle() || '',
        phoneNumber: savedAddresses.length == 0 ? user.phoneNumber || '' : undefined,
      }));
    });
  }, [status, session]);

  // Load saved addresses (only on initial auth)
  const addressesLoadedRef = useRef(false);
  useEffect(() => {
    if (addressesLoadedRef.current) return;
    const loadData = async () => {
      if (status !== 'authenticated' || !session?.user?.accessToken) return;
      addressesLoadedRef.current = true;
      setAddressesLoading(true);
      try {
        const service = new ProfileService(session.user.accessToken);
        const addrRes = await service.getUserAddresses();
        debugger
        if (addrRes.succeeded && addrRes.data && addrRes.data.length > 0) {
          setSavedAddresses(addrRes.data);
          const persistedId = checkoutPersist.selectedAddressId;
          const persistedAddr = persistedId && persistedId !== 'new'
            ? addrRes.data.find((a) => String(a.id) === persistedId)
            : null;
          if (persistedAddr) {
            setSelectedAddressId(persistedId ?? 'new');
            setAddrForm(persistedAddr);
          } else {
            const defaultAddr = addrRes.data.find((a) => a.isDefault);
            const addrToSelect = defaultAddr || addrRes.data[0];
            if (addrToSelect) {
              setSelectedAddressId(String(addrToSelect.id));
              setAddrForm(addrToSelect);
              checkoutPersist.setCheckoutPersist({ selectedAddressId: String(addrToSelect.id) });
            }
          }
        } else {
          setSavedAddresses([]);
          setSelectedAddressId('new');
          checkoutPersist.setCheckoutPersist({ selectedAddressId: 'new' });
        }
      } catch {
        // Silent fail
      } finally {
        setAddressesLoading(false);
      }
    };
    loadData();
  }, [status, session]);

  // Sync address form changes to shipping form
  useEffect(() => {
    setShipping((prev) => ({
      ...prev,
      address: addrForm,
      addressId: addrForm.id || undefined,
    }));
  }, [addrForm]);

  // Handle address selection from saved addresses
  const shippingRef = useRef(shipping);
  shippingRef.current = shipping;

  const handleAddressSelect = useCallback((value: string) => {
    setSelectedAddressId(value);
    checkoutPersist.setCheckoutPersist({ selectedAddressId: value });
    const s = shippingRef.current;
    if (value === 'new') {
      setAddrForm({
        id: 0,
        userId: 0,
        title: getNextAddressTitle(),
        countryId: 0,
        countryName: '',
        stateProvinceId: 0,
        stateProvinceName: '',
        city: '',
        address1: '',
        zipPostalCode: '',
        phoneNumber: s.phone,
        isDefault: false,
      });
    } else {
      const addr = savedAddresses.find((a) => a.id === Number(value));
      if (addr) {
        setAddrForm({
          ...addr,
          phoneNumber: addr.phoneNumber || s.phone,
        });
      }
    }
  }, [savedAddresses, getNextAddressTitle, checkoutPersist.setCheckoutPersist]);

  // Shipping field setter
  const setShippingField = useCallback(
    (field: keyof ShippingForm, value: string | boolean) => {
      setShipping((prev) => ({ ...prev, [field]: value }));
      if (field === 'note') {
        checkoutPersist.setCheckoutPersist({ shippingNote: String(value) });
      }
    },
    [checkoutPersist.setCheckoutPersist],
  );

  // Payment field setter
  const setPaymentField = useCallback(
    (field: keyof PaymentForm, value: PaymentMethod) => {
      setPayment((prev) => ({ ...prev, [field]: value }));
      if (field === 'method') {
        checkoutPersist.setCheckoutPersist({ paymentMethod: value });
      }
    },
    [checkoutPersist.setCheckoutPersist],
  );

  /* ── Calculations ─────────────────────────────────────────── */
  const subtotal = totalPrice();
  const savings = totalSavings();
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;

  const discountAmount = useMemo(() => {
    if (!appliedPromo || !VALID_PROMOS[appliedPromo]) return 0;
    const promo = VALID_PROMOS[appliedPromo];
    if (promo.type === 'percent') return subtotal * (promo.value / 100);
    return promo.value;
  }, [appliedPromo, subtotal]);

  const total = subtotal + shippingCost + tax - discountAmount;

  /* ── Promo Code ───────────────────────────────────────────── */
  const handleApplyPromo = useCallback(() => {
    const code = promoInput.trim().toUpperCase();
    if (!VALID_PROMOS[code]) {
      setPromoError(t('invalidCode'));
      return;
    }
    setAppliedPromo(code);
    checkoutPersist.setCheckoutPersist({ appliedPromo: code });
    setPromoError('');
    setPromoInput('');
    setShowPromoInput(false);
  }, [promoInput, t, checkoutPersist.setCheckoutPersist]);

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(null);
    checkoutPersist.setCheckoutPersist({ appliedPromo: null });
    setPromoInput('');
  }, [checkoutPersist.setCheckoutPersist]);

  /* ── Validation ───────────────────────────────────────────── */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePayment = useCallback((): boolean => {
    return true;
    // if (payment.method !==  PaymentMethod.CreditCard) {
    //   setErrors({});
    //   return true;
    // }
    // const errs: Record<string, string> = {};
    // return Object.keys(errs).length === 0;

  }, [payment]);

  /* ── Step Navigation ──────────────────────────────────────── */
  const goToStep = useCallback((step: CheckoutStep, dir?: 1 | -1) => {
    setDirection(dir ?? (step > currentStep ? 1 : -1));
    setCurrentStep(step);
    checkoutPersist.setCheckoutPersist({ currentStep: step });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, checkoutPersist.setCheckoutPersist]);

  const handleContinueShipping = useCallback(async () => {
    // Validate contact info
    const contactErrors: Record<string, string> = {};
    if (!shipping.fullName.trim()) contactErrors.fullName = t('fieldRequired');
    // Validate address form
    const addrErrors: Record<string, string> = {};
    if (!addrForm.title?.trim()) addrErrors.title = t('fieldRequired');
    if (!addrForm.address1?.trim()) addrErrors.address1 = t('fieldRequired');
    if (!addrForm.countryId) addrErrors.country = t('fieldRequired');
    if (!addrForm.stateProvinceId) addrErrors.state = t('fieldRequired');
    if (!addrForm.city?.trim()) addrErrors.city = t('fieldRequired');
    if (!addrForm.phoneNumber?.trim()) addrErrors.phoneNumber = t('fieldRequired');

    // Merge all errors
    const allErrors = { ...contactErrors, ...addrErrors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    if (session?.user?.accessToken) {
      setIsPlacing(true);
      try {
        // Only update user profile if contact info changed
        const accountService = new AccountService(session.user.accessToken);
        const currentUser = await accountService.getCurrentUser();
        const contactChanged =
          shipping.fullName?.trim() !== currentUser?.name?.trim() ||
          shipping.email?.trim() !== currentUser?.email?.trim() ||
          shipping.phone?.trim() !== currentUser?.phoneNumber?.trim();

        if (contactChanged) {

          const updateResult = await accountService.updateCurrentUser({
            ...currentUser,
            name: shipping.fullName,
            email: shipping.email,
            phoneNumber: shipping.phone,
          });
          if (!updateResult.succeeded) {
            toast.error(updateResult.message || t('addressSaveFailed'));
            setIsPlacing(false);
            return;
          }
        }

        // Save or update address
        const profileService = new ProfileService(session.user.accessToken);

        if (selectedAddressId === 'new') {
          const res = await profileService.addAddress(addrForm);
          if (res.succeeded && res.data) {
            const newAddr = { ...addrForm, ...res.data };
            setSavedAddresses((prev) => [...prev, newAddr]);
            setSelectedAddressId(String(res.data!.id));
            setAddrForm(newAddr);
            setShipping((prev) => ({ ...prev, addressId: res.data!.id }));
            toast.success(t('addressSaved'));
          } else {
            toast.error(res.message || t('addressSaveFailed'));
            setIsPlacing(false);
            return;
          }
        } else {
          // Only call update if the address was actually modified
          const original = savedAddresses.find((a) => a.id === Number(selectedAddressId));
          const addrChanged = !original || JSON.stringify(addrForm) !== JSON.stringify(original);
          if (addrChanged) {
            const res = await profileService.updateAddress(addrForm);
            if (!res.succeeded) {
              toast.error(res.message || t('addressUpdateFailed'));
              setIsPlacing(false);
              return;
            }
          }
          setShipping((prev) => ({ ...prev, addressId: addrForm.id }));
        }
      } catch {
        toast.error(t('addressSaveFailed'));
        setIsPlacing(false);
        return;
      } finally {
        setIsPlacing(false);
      }
    }

    goToStep(2);
  }, [shipping, addrForm, selectedAddressId, savedAddresses, session, goToStep, t]);

  const handleContinuePayment = useCallback(() => {
    if (validatePayment()) goToStep(3);
  }, [validatePayment, goToStep]);

  const handlePlaceOrder = useCallback(async () => {
    if (!session?.user?.accessToken) {
      toast.error(t('loginRequired'));
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    setIsPlacing(true);
    try {
      // Build order model using OrderDisplayModel
      const orderService = new OrderService(session.user.accessToken);
      const order: CreateOrderRequest = {
        addressId: shipping.addressId || null,
        shippingMethodId: ShippingMethod.Ground,
        paymentMethodId: payment.method,
        orderNote: shipping.note || '',
        discountId: null,
        items: items.map((item) => ({
          productVariantId: item.variant.id,
          quantity: item.quantity,
          unitPrice: item.variant.sellPrice,
        } as CreateOrderItemRequest)),
      };

      const result = await orderService.createOrder(order);

      if (result.succeeded && result.data) {
        setOrderNumber(`ORD-${result.data.id}`);
        clearCart();
        checkoutPersist.clearCheckoutPersist();
        toast.success(t('orderPlaced'));
        goToStep(4, 1);
      } else {
        toast.error(result.message || t('orderFailed'));
      }
    } catch {
      toast.error(t('orderFailed'));
    } finally {
      setIsPlacing(false);
    }
  }, [session, shipping, payment, total, shippingCost, tax, discountAmount, items, clearCart, checkoutPersist.clearCheckoutPersist, goToStep, router, t]);

  /* ── Auth Loading / Redirect ──────────────────────────────────── */
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-ecommerce-surface gap-4">
        <Loader2 size={32} className="text-ecommerce-red animate-spin" />
        <p className="text-sm text-ecommerce-text-muted">
          {status === 'unauthenticated' ? t('loginRequired') : t('loading')}
        </p>
      </div>
    );
  }

  /* ── Empty Cart ───────────────────────────────────────────── */
  if (items.length === 0 && currentStep < 4) {
    return <>
      <Header />
      <EmptyCart />
    </>;
  }

  /* ── Step progress data ───────────────────────────────────── */
  const steps = [
    { num: 1 as const, label: t('step1') },
    { num: 2 as const, label: t('step2') },
    { num: 3 as const, label: t('step3') },
    { num: 4 as const, label: t('step4') },
  ];

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-white dark:bg-ecommerce-surface">
        {/* Breadcrumb bar */}
        <div className="border-b border-ecommerce-border bg-ecommerce-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <Link
                href="/products"
                className="text-ecommerce-text-muted hover:text-ecommerce-text-primary transition-colors"
              >
                {t('breadcrumbHome')}
              </Link>
              <ChevronRight size={14} className="text-ecommerce-text-muted" />
              <span className="text-ecommerce-text-muted">{t('breadcrumbCart')}</span>
              <ChevronRight size={14} className="text-ecommerce-text-muted" />
              <span className="font-medium text-ecommerce-text-primary">{t('breadcrumbCheckout')}</span>
            </nav>
          </div>
        </div>

        {/* Page header */}
        <div className="bg-ecommerce-surface border-b border-ecommerce-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center gap-4">
              {currentStep < 4 && (
                <Link href="/products" className="hidden sm:block">
                  <button className="w-9 h-9 rounded-lg bg-ecommerce-surface-hover flex items-center justify-center hover:bg-ecommerce-border transition-colors">
                    <ArrowLeft size={16} className="text-ecommerce-text-secondary" />
                  </button>
                </Link>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-ecommerce-text-primary">
                  {currentStep === 4 ? t('orderConfirmed') : t('title')}
                </h1>
                <p className="text-xs text-ecommerce-text-muted mt-0.5 hidden sm:block">
                  {t('itemsInCart', { count: totalItems() })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          {currentStep < 4 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Step Progress Indicator */}
              <StepProgress currentStep={currentStep} steps={steps} />

              {/* Mobile Order Summary (collapsible accordion) */}
              <Accordion type="single" collapsible defaultValue="summary" className="md:hidden mb-6">
                <AccordionItem value="summary" className="border-ecommerce-border">
                  <AccordionTrigger className="text-sm font-bold text-ecommerce-text-primary hover:no-underline py-3">
                    <div className="flex items-center gap-2">
                      {t('cartSummary')} ({totalItems()} {t('itemsCount', { count: totalItems() })})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <OrderSummary
                      items={items}
                      appliedPromo={appliedPromo}
                      showPromoInput={showPromoInput}
                      promoInput={promoInput}
                      promoError={promoError}
                      subtotal={subtotal}
                      savings={savings}
                      shippingCost={shippingCost}
                      tax={tax}
                      discountAmount={discountAmount}
                      total={total}
                      onApplyPromo={handleApplyPromo}
                      onRemovePromo={handleRemovePromo}
                      onPromoInputChange={setPromoInput}
                      onPromoInputClearError={() => setPromoError('')}
                      onShowPromoInput={() => setShowPromoInput(true)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Main layout: content + sidebar */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main content (left) */}
                <div className="flex-1 min-w-0">
                  <Card className="border-ecommerce-border bg-white dark:bg-ecommerce-surface">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          initial={{ opacity: 0, x: direction * 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: direction * -40 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          {currentStep === 1 && (
                            <ShippingStep
                              shipping={shipping}
                              errors={errors}
                              savedAddresses={savedAddresses}
                              selectedAddressId={selectedAddressId}
                              addrForm={addrForm}
                              isSaving={isPlacing}
                              onSetShippingField={setShippingField}
                              onSetAddrForm={setAddrForm}
                              onAddressSelect={handleAddressSelect}
                              onContinue={handleContinueShipping}
                            />
                          )}
                          {currentStep === 2 && (
                            <PaymentStep
                              payment={payment}
                              errors={errors}
                              onSetPaymentField={setPaymentField}
                              onBack={() => goToStep(1, -1)}
                              onContinue={handleContinuePayment}
                            />
                          )}
                          {currentStep === 3 && (
                            <ReviewStep
                              items={items}
                              shipping={shipping}
                              payment={payment}
                              subtotal={subtotal}
                              savings={savings}
                              shippingCost={shippingCost}
                              tax={tax}
                              discountAmount={discountAmount}
                              total={total}
                              appliedPromo={appliedPromo}
                              showPromoInput={showPromoInput}
                              promoInput={promoInput}
                              promoError={promoError}
                              isPlacing={isPlacing}
                              onGoToStep={goToStep}
                              onApplyPromo={handleApplyPromo}
                              onRemovePromo={handleRemovePromo}
                              onPlaceOrder={handlePlaceOrder}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </div>

                {/* Sticky sidebar (desktop only) */}
                <div className="hidden md:block w-full lg:w-[380px] xl:w-[400px] shrink-0">
                  <div className="lg:sticky lg:top-6">
                    <OrderSummary
                      items={items}
                      appliedPromo={appliedPromo}
                      showPromoInput={showPromoInput}
                      promoInput={promoInput}
                      promoError={promoError}
                      subtotal={subtotal}
                      savings={savings}
                      shippingCost={shippingCost}
                      tax={tax}
                      discountAmount={discountAmount}
                      total={total}
                      onApplyPromo={handleApplyPromo}
                      onRemovePromo={handleRemovePromo}
                      onPromoInputChange={setPromoInput}
                      onPromoInputClearError={() => setPromoError('')}
                      onShowPromoInput={() => setShowPromoInput(true)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Step - full width */}
          {currentStep === 4 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Card className="border-ecommerce-border bg-white dark:bg-ecommerce-surface">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <ConfirmationStep orderNumber={orderNumber} email={shipping.email} />
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <div className="mt-auto">
          <Footer />
        </div>
        <BackToTop />
        <MobileBottomNav />
      </div>
    </>
  );
}
