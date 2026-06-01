export function Capitalize(input: string): string {
  const str = input.toString();
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function Truncate(input: string, length: number = 30): string {
  const str = input.toString();
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};
