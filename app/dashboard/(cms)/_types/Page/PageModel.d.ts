interface PageModel {
    id: number;
    pageTitle: string;
    subject: string;
    body: string;
    registerDate?: string; // Use string for dates in ISO 8601 format
    writer?: AuthorModel;
    writerId?: number;
    editor?: AuthorModel | null; // Optional and nullable
    editorId?: number | null;   // Optional and nullable
    editDate?: string | null;  // Optional and nullable, ISO 8601 format
    tags: string[];
  }