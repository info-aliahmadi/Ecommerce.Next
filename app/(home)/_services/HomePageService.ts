import CONFIG from "@root/config";
import Fetch from "@root/utils/Fetch";
import Result from "@root/app/types/Result";
import ProductTagModel from "@root/app/dashboard/(ecommerce)/_types/Product/ProductTagModel";
import ProductFilterModel from "../_types/ProductFilterModel";
import ArticleModel from "@root/app/dashboard/(cms)/_types/Article/ArticleMode";
import PageModel from "@root/app/dashboard/(cms)/_types/Page/PageModel";
import TopicModel from "@root/app/dashboard/(cms)/_types/Topic/TopicModel";
import TagModel from "@root/app/dashboard/(cms)/_types/Tag/TagModel";
import LinkModel from "@root/app/dashboard/(cms)/_types/Link/LinkModel";
import SlideshowModel from "@root/app/dashboard/(cms)/_types/Slideshow/SlideshowModel";
import SiteSettingsModel from "@root/app/dashboard/(cms)/_types/SiteSetting/SiteSettingsModel";
import MenuModel from "@root/app/dashboard/(cms)/_types/Menu/MenuModel";
import ProductDisplayModel from "../_types/ProductDisplayModel";
import CategoryDisplayModel from "../_types/CategoryDisplayModel";
import ManufacturerDisplayModel from "../_types/ManufacturerDisplayModel";
import PaginatedDisplayList from "../_types/PaginatedList";
import ProductTags from "@root/app/types/enums/ProductTags";
import SortingType from "@root/app/types/enums/SortingType";
import CuratedStyleProductModel from "../_types/CuratedStyleProductModel";

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

  /**
   * Get all categories for display
   */
  async getAllCategories(): Promise<Result<CategoryDisplayModel[]>> {
    let result = await Fetch.Get<Result<CategoryDisplayModel[]>>(`${CONFIG.API_BASEPATH}/Product/GetCategories`, this.config);
    return result;
  }

  /**
   * Get all product tags for display
   */
  async getAllProductTags(): Promise<Result<ProductTagModel[]>> {
    let result = await Fetch.Get<Result<ProductTagModel[]>>(`${CONFIG.API_BASEPATH}/Product/GetProductTags`, this.config);
    return result;
  }

  /*
    * Get all manufacturers for display
*/
  async getAllManufacturers(): Promise<Result<ManufacturerDisplayModel[]>> {
    let result = await Fetch.Get<Result<ManufacturerDisplayModel[]>>(`${CONFIG.API_BASEPATH}/Product/GetManufacturers`, this.config);
    return result;
  }

  async getFeaturedProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 8,
      productTagIds : [ProductTags.Featured]
    }
    let result = await this.getProducts(filter);
    return result;
  }

  async getTrendProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 8,
      productTagIds : [ProductTags.Trending]
    }
    let result = await this.getProducts(filter);
    return result;
  }

  async getBestSellingProducts(): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    let filter: ProductFilterModel = {
      pageIndex: 1,
      pageSize: 8,
      productTagIds : [ProductTags.Bestseller]
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
  async searchProducts(filter: ProductFilterModel): Promise<Result<PaginatedDisplayList<ProductDisplayModel>>> {
    const response = await this.getProducts(filter);
    return response;
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
    let result = await Fetch.Get<Result<ArticleModel[]>>(`${this.baseUrl}/Cms/GetArticles?pageIndex=${pageIndex}&pageSize=${pageSize}`, this.config);
    return result;
  }

  /**
   * Get related articles for visitors
   */
  async getRelatedArticlesList(articleId: number): Promise<Result<ArticleModel[]>> {
    let result = await Fetch.Get<Result<ArticleModel[]>>(`${this.baseUrl}/Cms/GetRelatedArticles?articleId=${articleId}`, this.config);
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
    let result = await Fetch.Get<Result<ArticleModel>>(`${this.baseUrl}/Cms/GetArticle?articleId=${articleId}`, this.config);
    return result;
  }

  /**
   * Get page by ID for visitors
   */
  async getPage(pageId: number): Promise<Result<PageModel>> {
    let result = await Fetch.Get<Result<PageModel>>(`${this.baseUrl}/Cms/GetPage?pageId=${pageId}`, this.config);
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
  async getLinksByKeyList(key: string): Promise<Result<LinkModel[]>> {
    let result = await Fetch.Get<Result<LinkModel[]>>(`${this.baseUrl}/Cms/GetLinksByKey?key=${encodeURIComponent(key)}`, this.config);
    return result;
  }
  /**
   * Get slideshows
   */
  async getSlideshows(keys: string[]): Promise<Result<SlideshowModel[]>> {
    let result = await Fetch.Get<Result<SlideshowModel[]>>(`${this.baseUrl}/Cms/GetSlideshows`, this.config);
    return result;
  }
}
