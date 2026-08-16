export default interface FileUploadModel {
    id: number;
    fileName: string;
    directory: string;
    thumbnail?: string;
    extension: string;
    size: number;
    tags?: string;
    alt?: string;
    uploadDate: Date;
    userName: string;
    userId: number;
    fullPath : string;
    thumbnailFullPath : string;
    
}