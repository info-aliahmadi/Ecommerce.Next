import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import AuthorModel from "./AuthorModel";

export default interface ArticleModel {
    id: number;
    subject: string;
    body: string;
    previewImageId?: number;
    previewImage?: FileUploadModel;
    previewImageUrl?: string;
    registerDate?: Date;
    publishDate?: Date;
    writer?: AuthorModel;
    writerId?: number;
    editor?: AuthorModel;
    editorId?: number;
    editDate?: Date;
    isPinned: boolean;
    isDraft: boolean;
    isDeleted: boolean;
    topicsIds: number[];
    tags: string[];
    topics?: string[];
}