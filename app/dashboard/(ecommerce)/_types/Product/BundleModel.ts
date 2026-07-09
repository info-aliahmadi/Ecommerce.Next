/**
 * Represents a product bundle.
 */
export default interface BundleModel {
    /**
     * The ID of the bundle.
     */
    id: number;
  
    /**
     * The name of the bundle.
     */
    name: string;
  
    /**
     * Description of the bundle.
     */
    description: string;
  
    /**
     * Indicates whether the bundle is shown on the homepage.
     */
    showOnHomepage: boolean;
  
    /**
     * The display order of the bundle.
     */
    displayOrder: number;
  
    /**
     * The date and time the bundle was created (in UTC).
     */
    createdOnUtc: Date;
  
    /**
     * any bundle have multiple product(with displayorder) wich is saved in productbundle
     */
    products?: ProductBundleModel[]; // Optional, as a bundle might not have children
  }  
  
  export interface ProductBundleModel {
    bundleId: number;
     productId: number;
     displayOrder: number;
  }
