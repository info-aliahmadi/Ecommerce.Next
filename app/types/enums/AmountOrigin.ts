enum AmountOrigin {
  // پرداخت قرض
  CashReceipt = 1,
  // خرید نقدی
  CashOrder = 2,
  // خرید قرضی
  DebitOrder = 3,
  // خرید اعتباری
  CreditOrder = 4,
  // بستن سال مالی
  ClosedYear = 5,
  // فاکتور خرید
  BuyIncoice = 6,
  // کسر موجودی
  InventoryDeduction = 7,
}
export default AmountOrigin;
