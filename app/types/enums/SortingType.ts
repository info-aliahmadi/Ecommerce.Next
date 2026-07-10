enum SortingType {
  // آخرین محصولات
  SortNewest = 1,
  // قدیمی ترین محصولات
  SortOldest = 2,
  // از قیمت کم به بیشتر
  SortPriceAsc = 3,
  // از قیمت بیشتر به کمتر
  SortPriceDesc = 4,
  // بیشترین بازخورد
  SortPopular = 5,
  // بیشترین امتیاز
  SortRating = 6,
  // به ترتیب الفبا  
  SortNameAsc = 7,
  // برعکس ترتیب الفبا
  SortNameDesc = 8,
}
export default SortingType;

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'name-asc' | 'name-desc';