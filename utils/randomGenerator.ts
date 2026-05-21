export default function getRandomNumber(): number {
  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return 0;
  }
  return Math.random();
}

export const getRandomUUID = (): string => {
  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return '00000000-0000-0000-0000-000000000000';
  }
  
  // Compatible UUID v4 generator that works in all environments
  // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};