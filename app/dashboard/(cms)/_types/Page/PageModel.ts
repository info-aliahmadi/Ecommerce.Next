import AuthorModel from "../Article/AuthorModel";

export default interface PageModel {
    id: number;
    pageTitle: string;
    subject: string;
    body: string;
    registerDate?: Date; // Use string for dates in ISO 8601 format
    writer?: AuthorModel;
    writerId?: number;
    editor?: AuthorModel | null; // Optional and nullable
    editorId?: number | null;   // Optional and nullable
    editDate?: Date | null;  // Optional and nullable, ISO 8601 format
    tags: string[];
  }