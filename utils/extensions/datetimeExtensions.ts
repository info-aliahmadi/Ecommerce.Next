import { formatDistanceToNow } from "date-fns";
import { DateTimeViewer, DateViewer } from "../DateViewer";

// Extend the Number interface
declare global {
    interface Date {
        toDistanceToNow(): string;
        toLocalDatetime(currentLanguage: string): string;
        toLocalDate(currentLanguage: string): string;
    }
}

Date.prototype.toDistanceToNow = function (): string {
    // Only run on client side to avoid hydration mismatch
    if (this == undefined)
        return '';

    return formatDistanceToNow(new Date(this), { addSuffix: false, includeSeconds: false });
};

Date.prototype.toLocalDatetime = function (currentLanguage: string): string {
    
    return DateTimeViewer(currentLanguage, this);
};

Date.prototype.toLocalDate = function (currentLanguage: string): string {
    
    return DateViewer(currentLanguage, this);
};


export { };
