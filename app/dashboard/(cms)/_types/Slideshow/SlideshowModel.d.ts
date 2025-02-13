interface SlideshowModel {
    id: number;
    header: string;
    description: string;
    previewImageId?: number | null;
    previewImage?: FileUploadModel | null;
    previewImageUrl?: string | null;
    order?: number;
    isVisible?: boolean;
    createDate?: string; // ISO 8601 string format for dates
    user?: AuthorModel;
    userId?: number;
  }