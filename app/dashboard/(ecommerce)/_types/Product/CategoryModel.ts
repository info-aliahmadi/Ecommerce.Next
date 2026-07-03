import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";

/**
 * Represents a product category.
 */
export default interface CategoryModel {
    /**
     * The ID of the category.
     */
    id: number;
  
    /**
     * The name of the category.
     */
    name: string;
  
    /**
     * The name of the category.
     */
    key: string;
  
    /**
     * Meta keywords for SEO.
     */
    metaKeywords: string;
  
    /**
     * Meta title for SEO.
     */
    metaTitle: string;
  
    /**
     * Description of the category.
     */
    description: string;
  
    /**
     * Meta description for SEO.
     */
    metaDescription: string;
    /**
     * Meta description for SEO.
     */
    color?: string;
  
    /**
     * The ID of the parent category (nullable).
     */
    parentCategoryId: number | null;
  
    /**
     * The ID of the associated picture (nullable).
     */
    pictureId: number | null;
    /**
     * The ID of the associated picture (nullable).
     */
    pictureInfo: FileUploadModel | null;
  
    /**
     * Indicates whether the category is shown on the homepage.
     */
    showOnHomepage: boolean;
  
    /**
     * Indicates whether the category is published.
     */
    published: boolean;
  
    /**
     * Indicates whether the category is deleted.
     */
    deleted: boolean;
  
    /**
     * The display order of the category.
     */
    displayOrder: number;
  
    /**
     * The date and time the category was created (in UTC).
     */
    createdOnUtc: Date;
  
    /**
     * The date and time the category was last updated (in UTC).
     */
    updatedOnUtc: Date;
  
    /**
     * The number of products associated with this category.
     */
    productsCount: number;
  
    /**
     * The number of discounts associated with this category.
     */
    discounts: number;
  
    /**
     * Indicates whether the category is edited.
     */
    isEdited: boolean;
    /**
     * Child categories.
     */
    childs?: CategoryModel[]; // Optional, as a category might not have children
  }