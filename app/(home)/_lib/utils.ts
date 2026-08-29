import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel"
import CONFIG from "@root/config"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function GetImage(imagePreview?: FileUploadModel | undefined | null, thumbnail: boolean | undefined = false): string {
  const path = thumbnail ? imagePreview?.thumbnailFullPath || imagePreview?.fullPath : imagePreview?.fullPath || imagePreview?.thumbnailFullPath;
  return path
    ? `${CONFIG.API_BASEPATH}${path}`
    : CONFIG.UNKNOWN_IMAGE_BASEPATH;
}
export async function getCustomerIp(): Promise<string> {
  const cached = typeof window !== 'undefined' ? localStorage.getItem('customerIp') : null;
  if (cached) return cached;
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    if (data.ip) {
      localStorage.setItem('customerIp', data.ip);
      return data.ip;
    }
  } catch {}
  return '';
}

export  function getThumbnailName(filename : string) {
  if (!filename) return "";

  const lastDotIndex = filename.lastIndexOf(".");

  // If there is no dot, or the dot is the first character (e.g., hidden files like ".env")
  if (lastDotIndex <= 0) {
    return `${filename}-Thumb.jpg`;
  }

  // Extract the base name without the extension
  const baseName = filename.substring(0, lastDotIndex);
  
  return `${baseName}-Thumb.jpg`;
}