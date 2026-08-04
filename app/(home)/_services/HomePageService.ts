import CONFIG from "@root/config";
import Fetch from "@root/utils/Fetch";
import Result from "@root/app/types/Result";
import ProductFilterModel from "../_types/Product/ProductFilterModel";
import ArticleModel from "@root/app/dashboard/(cms)/_types/Article/ArticleMode";
import PageModel from "@root/app/dashboard/(cms)/_types/Page/PageModel";
import TopicModel from "@root/app/dashboard/(cms)/_types/Topic/TopicModel";
import TagModel from "@root/app/dashboard/(cms)/_types/Tag/TagModel";
import LinkModel from "@root/app/dashboard/(cms)/_types/Link/LinkModel";
import SiteSettingsModel from "@root/app/dashboard/(cms)/_types/SiteSetting/SiteSettingsModel";
import MenuModel from "@root/app/dashboard/(cms)/_types/Menu/MenuModel";
import ProductDisplayModel from "../_types/Product/ProductDisplayModel";
import CategoryDisplayModel from "../_types/Product/CategoryDisplayModel";
import ManufacturerDisplayModel from "../_types/Product/ManufacturerDisplayModel";
import PaginatedDisplayList from "../_types/PaginatedList";
import ProductTags from "@root/app/types/enums/ProductTags";
import SortingType from "@root/app/types/enums/SortingType";
import ProductTagDisplayModel from "../_types/Product/ProductTagDisplayModel";
import ProductAttributeDisplayModel from "../_types/Product/ProductAttributeDisplayModel";
import AttributeType from "@root/app/types/enums/AttributeType";
import CuratedStyleProductModel from "../_types/Product/CuratedStyleProductModel";
import BundleDisplayModel from "../_types/Product/BundleDisplayModel";
import SlideshowDisplayModel from "../_types/SlideshowDisplayModel";
import SubscribeUserModel from "../_types/SubscribeUserModel";
import ProductReviewDisplayModel from "../_types/Product/ProductReviewDisplayModel";
import ProductInventoryStockModel from "../_types/Product/ProductInventoryStockModel";

export default class HomePageService {

  config?: RequestInit;
  baseUrl: string;

  constructor() {
    this.config = Fetch.SetDefaultHeader();
    this.baseUrl = CONFIG.API_BASEPATH ?? '';
  }
  /**
   * these are my favorite endpoints for the homepage, 
   * I will use them to display products in different
   *  sections like featured, best selling, latest,
   *  and on sale. I will also add a search function
   *  to allow users to find products by name or description.
   * 
   * /GetProducts
   * /GetCategories
   * /GetProductTags
   * /GetManufacturers
   */

  async getProducts(filter: ProductFilterModel): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let result = await Fetch.Post<Result<PaginatedDisplayList<ProductDisplayModel>>>(`${this.baseUrl}/Product/GetProducts`, filter, this.config);
    return result;
  }

  async getCuratedStyleProducts(): Promise<Result<CuratedStyleProductModel[]>> {
    let result = await Fetch.Get<Result<CuratedStyleProductModel[]>>(`${this.baseUrl}/Product/GetCuratedStyleProducts`, this.config);
    return result;
  }

  async getFeaturedProductsByFilter(filter: ProductFilterModel): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    filter.productTagIds = [ProductTags.Featured];
    let result = await this.getProducts(filter);
    return result;
  }
  // it means product
  async getFeaturedProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 8,
      productTagIds: [ProductTags.Featured]
    }
    let result = await this.getProducts(filter);
    return result;
  }


  async getTrendProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 10,
      productTagIds: [ProductTags.Trending]
    }
    let result = await this.getProducts(filter);
    return result;
  }

  async getBestSellingProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 4,
      productTagIds: [ProductTags.Bestseller]
    }
    const response = await this.getProducts(filter);
    return response;
  }

  async getBestDealProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 4,
      hasDiscounts: true,
      sorting: SortingType.SortPriceAsc
    }
    const response = await this.getProducts(filter);
    return response;
  }

  /**
   * Get latest products
   */
  async getLatestProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 8,
      sorting: SortingType.SortNewest
    }
    const response = await this.getProducts(filter);
    return response;
  }

  /**
   * Search products by query
   */
  async searchProducts(input: string): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      searchInput: input,
      pageIndex: 1,
      pageSize: 10,
      sorting: SortingType.SortNewest
    }
    const response = await this.getProducts(filter);
    return response;
  }

  async getProductById(productId: number): Promise<Result<ProductDisplayModel>> {
    const params = new URLSearchParams({ productId: productId.toString() });
    let result = await Fetch.Get<Result<ProductDisplayModel>>(`${this.baseUrl}/Product/GetProduct?${params.toString()}`, this.config);
    return result;
  }
  /**
   * Get site settings
   */
  async getBundles(): Promise<Result<BundleDisplayModel[]>> {
    let result = await Fetch.Get<Result<BundleDisplayModel[]>>(`${this.baseUrl}/Product/GetPublishedBundles`, this.config);
    return result;
  }

  /**
   * Get all categories for display
   */
  async getAllCategories(): Promise<Result<CategoryDisplayModel[]>> {
    let result = await Fetch.Get<Result<CategoryDisplayModel[]>>(`${this.baseUrl}/Product/GetCategories`, this.config);
    return result;
  }

  /**
   * Get all categories for display
   */
  async getAllFeaturedCategories(): Promise<Result<CategoryDisplayModel[]>> {
    let result = await Fetch.Get<Result<CategoryDisplayModel[]>>(`${this.baseUrl}/Product/GetFeaturedCategories`, this.config);
    return result;
  }

  /*
    * Get all manufacturers or brands for display
*/
  async getAllManufacturers(): Promise<Result<ManufacturerDisplayModel[]>> {
    let result = await Fetch.Get<Result<ManufacturerDisplayModel[]>>(`${this.baseUrl}/Product/GetManufacturers`, this.config);
    return result;
  }

  /**
   * Get Product Tags
   */
  async getProductTags(): Promise<Result<ProductTagDisplayModel[]>> {
    let result = await Fetch.Get<Result<ProductTagDisplayModel[]>>(`${this.baseUrl}/Product/GetProductTags`, this.config);
    return result;
  }

  /**
   * Get Product Attributes
   */
  async getProductAttributes(): Promise<Result<ProductAttributeDisplayModel[]>> {
    let result = await Fetch.Get<Result<ProductAttributeDisplayModel[]>>(`${this.baseUrl}/Product/GetProductAttributes`, this.config);
    return result;
  }

  /**
   * Get Product Attributes
   */
  async getProductAttributesByType(attributeTypes: AttributeType[]): Promise<Result<ProductAttributeDisplayModel[]>> {
    // convert the attribute types to joined string
    let joinedAttributeTypes = attributeTypes.join(',');
    const params = new URLSearchParams({ attributeTypes: joinedAttributeTypes.toString() });
    let result = await Fetch.Get<Result<ProductAttributeDisplayModel[]>>(`${this.baseUrl}/Product/GetProductAttributesByType?${params.toString()}`, this.config);
    return result;
  }

  /**
   * Get Product Reviews
   */
  async getProductReviews(productId: number): Promise<Result<ProductReviewDisplayModel[]>> {
    const params = new URLSearchParams({ productId: productId.toString() });
    let result = await Fetch.Get<Result<ProductReviewDisplayModel[]>>(`${this.baseUrl}/Product/GetProductReviews?${params.toString()}`, this.config);
    return result;
  }


  /**
   * Get site settings
   */
  async getSettings(): Promise<Result<SiteSettingsModel>> {
    let result = await Fetch.Get<Result<SiteSettingsModel>>(`${this.baseUrl}/Cms/GetSettings`, this.config);
    return result;
  }

  /**
   * Get site menu
   */
  async getMenu(): Promise<Result<MenuModel>> {
    let result = await Fetch.Get<Result<MenuModel>>(`${this.baseUrl}/Cms/GetMenu`, this.config);
    return result;
  }

  /**
   * Get articles list for visitors
   */
  async getArticlesList(pageIndex: number = 0, pageSize: number = 10): Promise<Result<ArticleModel[]>> {
    const params = new URLSearchParams({ pageIndex: pageIndex.toString(), pageSize: pageSize.toString() });
    let result = await Fetch.Get<Result<ArticleModel[]>>(`${this.baseUrl}/Cms/GetArticles?${params.toString()}`, this.config);
    return result;
  }

  /**
   * Get related articles for visitors
   */
  async getRelatedArticlesList(articleId: number): Promise<Result<ArticleModel[]>> {
    const params = new URLSearchParams({ articleId: articleId.toString() });    
    let result = await Fetch.Get<Result<ArticleModel[]>>(`${this.baseUrl}/Cms/GetRelatedArticles?${params.toString()}`, this.config);
    return result;
  }

  /**
   * Get top article for visitors
   */
  async getTopArticle(): Promise<Result<ArticleModel>> {
    let result = await Fetch.Get<Result<ArticleModel>>(`${this.baseUrl}/Cms/GetTopArticle`, this.config);
    return result;
  }

  /**
   * Get article by ID for visitors
   */
  async getArticle(articleId: number): Promise<Result<ArticleModel>> {
    const params = new URLSearchParams({ articleId: articleId.toString() });
    let result = await Fetch.Get<Result<ArticleModel>>(`${this.baseUrl}/Cms/GetArticle?${params.toString()}`, this.config);
    return result;
  }

  /**
   * Get page by ID for visitors
   */
  async getPage(pageId: number): Promise<Result<PageModel>> {
    const params = new URLSearchParams({ pageId: pageId.toString() });
    let result = await Fetch.Get<Result<PageModel>>(`${this.baseUrl}/Cms/GetPage?${params.toString()}`, this.config);
    return result;
  }

  /**
   * Get topics list
   */
  async getTopicsList(): Promise<Result<TopicModel[]>> {
    let result = await Fetch.Get<Result<TopicModel[]>>(`${this.baseUrl}/Cms/GetTopics`, this.config);
    return result;
  }

  /**
   * Get tags list
   */
  async getTagsList(): Promise<Result<TagModel[]>> {
    let result = await Fetch.Get<Result<TagModel[]>>(`${this.baseUrl}/Cms/GetTags`, this.config);
    return result;
  }

  /**
   * Get links by key list
   */
  async getLinksByKeyList(sectionKey: string): Promise<Result<LinkModel[]>> {

    const params = new URLSearchParams({ sectionKey: sectionKey.toString() });
    let result = await Fetch.Get<Result<LinkModel[]>>(`${this.baseUrl}/Cms/GetLinksByKey?${params.toString()}`, this.config);
    return result;
  }
  /**
   * Get slideshows
   */
  async getSlideshows(): Promise<Result<SlideshowDisplayModel[]>> {
    let result = await Fetch.Get<Result<SlideshowDisplayModel[]>>(`${this.baseUrl}/Cms/GetSlideshows`, this.config);
    return result;
  }

  subscribe = async (subscribeUser: SubscribeUserModel): Promise<Result<SubscribeUserModel>> => {
    return Fetch.Post<Result<SubscribeUserModel>>(CONFIG.API_BASEPATH + `/Crm/SubscribeUser`, subscribeUser, this.config);
  };

}
