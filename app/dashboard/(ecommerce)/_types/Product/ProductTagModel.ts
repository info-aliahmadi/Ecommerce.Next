/**
 * Represents a product tag.
 */
export default interface ProductTagModel {
    /**
     * The ID of the product tag.
     */
    id: number;
  
    /**
     * The name of the product tag.
     */
    name: string;
    /**
     * The key of the product tag.
     */
    key: string;
  
    /**
     * The number of products associated with this tag.
     */
    products: number;
  }