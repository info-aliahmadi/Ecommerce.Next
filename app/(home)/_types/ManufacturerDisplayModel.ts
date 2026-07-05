/**
 * Represents a manufacturer.
 */
export default interface ManufacturerDisplayModel {
    /**
     * The ID of the manufacturer.
     */
    id: number;
  
    /**
     * The name of the manufacturer.
     */
    name: string;
  
    /**
     * Meta keywords for SEO.
     */
    metaKeywords: string;
  
    /**
     * Meta title for SEO.
     */
    metaTitle: string;
  
    /**
     * Description of the manufacturer.
     */
    description: string;
  
    /**
     * Meta description for SEO.
     */
    metaDescription: string;
  
    /**
     * The ID of the associated picture (nullable).
     */
    pictureId: number | null;
  
    /**
     * Indicates whether the manufacturer is published.
     */
    published: boolean;
  
    /**
     * Indicates whether the manufacturer is deleted.
     */
    deleted: boolean;
  
    /**
     * The display order of the manufacturer.
     */
    displayOrder: number;
  
    /**
     * The date and time the manufacturer was created (in UTC).
     */
    createdOnUtc: Date;
  
    /**
     * The date and time the manufacturer was last updated (in UTC).
     */
    updatedOnUtc: Date;
  
    /**
     * The number of product manufacturers associated with this manufacturer.
     */
    productManufacturers: number;
  
    /**
     * The number of discounts associated with this manufacturer.
     */
    discounts: number;
  }