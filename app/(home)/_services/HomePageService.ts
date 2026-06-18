import CONFIG from "@root/config";
import Fetch from "@root/utils/Fetch";
import Result from "@root/app/types/Result";
import ProductTagModel from "@root/app/dashboard/(ecommerce)/_types/Product/ProductTagModel";
import ManufacturerModel from "@root/app/dashboard/(ecommerce)/_types/Product/ManufacturerModel";
import CategoryModel from "@root/app/dashboard/(ecommerce)/_types/Product/CategoryModel";
import ProductFilterModel from "../_types/ProductFilterModel";
import ProductModel from "@root/app/dashboard/(ecommerce)/_types/Product/ProductModel";
import ArticleModel from "@root/app/dashboard/(cms)/_types/Article/ArticleMode";
import PageModel from "@root/app/dashboard/(cms)/_types/Page/PageModel";
import TopicModel from "@root/app/dashboard/(cms)/_types/Topic/TopicModel";
import TagModel from "@root/app/dashboard/(cms)/_types/Tag/TagModel";
import LinkModel from "@root/app/dashboard/(cms)/_types/Link/LinkModel";
import SlideshowModel from "@root/app/dashboard/(cms)/_types/Slideshow/SlideshowModel";

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

  /**
   * Get all categories for display
   */
  async getAllCategories(): Promise<Result<CategoryModel[]>> {
    let result = await Fetch.Get<Result<CategoryModel[]>>(`${CONFIG.API_BASEPATH}/Product/GetCategories`, this.config);
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
  async getAllManufacturers(): Promise<Result<ManufacturerModel[]>> {
    let result = await Fetch.Get<Result<ManufacturerModel[]>>(`${CONFIG.API_BASEPATH}/Product/GetManufacturers`, this.config);
    return result;
  }

  async getProducts(filter: ProductFilterModel): Promise<Result<ProductModel[]>> {
    let result = await Fetch.Post<Result<ProductModel[]>>(`${this.baseUrl}/Product/GetProducts`, filter, this.config);
    return result;
  }

  async getFeaturedProducts(): Promise<Result<ProductModel[]>> {
    let filter: ProductFilterModel = {
      pageIndex: 0,
      pageSize: 8,
      hasDiscounts: true,
      categoryIds: [],
      manufacturerIds: []
    }
    let result = await this.getProducts(filter);
    return result;
  }

  async getBestSellingProducts(): Promise<Result<ProductModel[]>> {
    let filter: ProductFilterModel = {
      pageIndex: 0,
      pageSize: 8,
      categoryIds: [],
      manufacturerIds: []
    }
    const response = await this.getProducts(filter);
    return response;
  }

  /**
   * Get latest products
   */
  async getLatestProducts(): Promise<Result<ProductModel[]>> {
    let filter: ProductFilterModel = {
      pageIndex: 0,
      pageSize: 8,
      sorting: { id: 'availableStartDateTimeUtc', desc: true },
      categoryIds: [],
      manufacturerIds: []
    }
    const response = await this.getProducts(filter);
    return response;
  }


  /**
   * Search products by query
   */
  async searchProducts(query: string, pageIndex: number = 0, pageSize: number = 10): Promise<Result<ProductModel[]>> {
    let filter: ProductFilterModel = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchInput: query,
      categoryIds: [],
      manufacturerIds: []
    }
    const response = await this.getProducts(filter);
    return response;
  }

  /**
   * Get site settings
   */
  async getSettings(): Promise<Result<any>> {
    let result = await Fetch.Get<Result<any>>(`${this.baseUrl}/Cms/GetSettings`, this.config);
    return result;
  }

  /**
   * Get site menu
   */
  async getMenu(): Promise<Result<any>> {
    let result = await Fetch.Get<Result<any>>(`${this.baseUrl}/Cms/GetMenu`, this.config);
    return result;
  }

  /**
   * Get articles list for visitors
   */
  async getArticlesList(pageIndex: number = 0, pageSize: number = 10): Promise<Result<any[]>> {
    let result = await Fetch.Get<Result<any[]>>(`${this.baseUrl}/Cms/GetArticles?pageIndex=${pageIndex}&pageSize=${pageSize}`, this.config);
    return result;
  }

  /**
   * Get related articles for visitors
   */
  async getRelatedArticlesList(articleId: number): Promise<Result<any[]>> {
    let result = await Fetch.Get<Result<any[]>>(`${this.baseUrl}/Cms/GetRelatedArticles?articleId=${articleId}`, this.config);
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
  async getLinksByKeyList(keys: string[]): Promise<Result<LinkModel[]>> {
    const keysParam = keys.map(k => `keys=${encodeURIComponent(k)}`).join('&');
    let result = await Fetch.Get<Result<LinkModel[]>>(`${this.baseUrl}/Cms/GetLinksByKey?${keysParam}`, this.config);
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
