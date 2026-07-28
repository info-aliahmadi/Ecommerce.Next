import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";

export default interface SlideshowDisplayModel {
    id: number;
    header: string;
    description: string;
    previewImageId?: number | null;
    previewImage?: FileUploadModel | null;
    previewImageUrl?: string | null;
    order?: number;
  }