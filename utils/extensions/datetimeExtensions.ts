import { formatDistanceToNow } from "date-fns";
import { DateTimeViewer, DateViewer } from "../DateViewer";

// Extend the Number interface
declare global {
    interface Date {
        toDistanceToNow(): string;
        toLocalDatetime(currentLanguage: string | undefined): string;
        toLocalDate(currentLanguage: string | undefined): string;
    }
}

Date.prototype.toDistanceToNow = function (): string {
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined') {
        return this.toISOString();
    }
    if (this == undefined)
        return '';

    return formatDistanceToNow(new Date(this), { addSuffix: false, includeSeconds: false });
};

Date.prototype.toLocalDatetime = function (currentLanguage?: string | undefined): string {
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined') {
        return this.toISOString();
    }
    if (currentLanguage == undefined || currentLanguage == null || currentLanguage == '' || this == undefined)
        return '';

    return DateTimeViewer(currentLanguage, this);
};

Date.prototype.toLocalDate = function (currentLanguage?: string | undefined): string {
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined') {
        return this.toISOString();
    }
    if (currentLanguage == undefined || currentLanguage == null || currentLanguage == '' || this == undefined)
        return '';

    return DateViewer(currentLanguage, this);
};


export { };
