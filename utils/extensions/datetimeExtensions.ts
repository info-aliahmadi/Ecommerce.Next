import { formatDistanceToNow } from "date-fns";

// Extend the Number interface
declare global {
    interface Date {
        toDistanceToNow(): string;
    }
}

Date.prototype.toDistanceToNow = function (): string {
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined') {
        return this.toISOString();
    }
    
    return formatDistanceToNow(new Date(this), { addSuffix: false, includeSeconds: false  });
};


export {};
