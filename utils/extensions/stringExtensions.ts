declare global {
  interface String {
    capitalize(): string;
    truncate(length?: number): string;
  }
}

String.prototype.capitalize = function (): string {
  const str = this.toString();
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

String.prototype.truncate = function (length: number = 30): string {
  const str = this.toString();
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export {};
