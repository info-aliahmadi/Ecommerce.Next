/**
 * Represents a ProductTag.
 */
export default interface ProductTagDisplayModel {
  /**
   * The ID of the ProductTag.
   */
  id: number;

  /**
   * The name of the ProductTag.
   */
  name: string;
  /**
   * The key of the ProductTag for access to it by name and for translation
   */
  key: string;
  
  /**
   * products Count
   */
  productsCount: string;

}