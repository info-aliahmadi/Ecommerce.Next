import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel"
import CONFIG from "@root/config"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function GetImage(imagePreview?: FileUploadModel | undefined | null, thumbnail: boolean | undefined = false): string {
  const path = thumbnail ? imagePreview?.thumbnailPath || imagePreview?.fullPath : imagePreview?.fullPath || imagePreview?.thumbnailPath;

  return path
    ? `${CONFIG.API_BASEPATH}${path}`
    : CONFIG.UNKNOWN_IMAGE_BASEPATH;
}
