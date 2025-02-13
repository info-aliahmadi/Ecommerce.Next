
interface LinkModel {
    id: number;
    title: string;
    url: string;
    imagePreviewId?: number | null; // Use optional chaining and allow null
    imagePreview?: FileUploadModel | null; // Use optional chaining and allow null
    description?: string;
    linkSectionId: number;
    linkSectionKey?: string;
    userId?: number;
    userName?: string;
    order: number;
  }