export default interface MenuModel {
  id: number;
  title: string;
  url: string;
  previewImageId?: number | null;
  order: number;
  userId: number;
  userName: string;
  color?: string;
  childs?: MenuModel[] | null; // Optional and nullable
  parent?: MenuModel | null;   // Optional and nullable
  parentId?: number | null;     // Optional and nullable
  isEdited: boolean;
}