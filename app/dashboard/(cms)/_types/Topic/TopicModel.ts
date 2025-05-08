
export default interface TopicModel {
    id: number;
    userId?: number;
    userName?: string;
    title: string;
    parent?: TopicModel | null; // Optional and nullable
    parentId?: number | null;   // Optional and nullable
    childs?: TopicModel[] | null; // Optional and nullable
    registerDate?: string;       // ISO 8601 string format for dates
  }