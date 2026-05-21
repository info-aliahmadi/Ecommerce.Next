import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import Fetch from '@root/utils/Fetch';
import { GridDataBound } from '@root/app/types/GridDataBound';
import ArticleModel from '../_types/Article/ArticleMode';

export default class ArticlesService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }


  getArticleList = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<ArticleModel>>> => {
    return Fetch.Post<Result<PaginatedList<ArticleModel>>>(CONFIG.API_BASEPATH + '/cms/GetArticleList', searchParams, this.config);
  };
  getArticleTrashList = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<ArticleModel>>> => {
    return Fetch.Post<Result<PaginatedList<ArticleModel>>>(CONFIG.API_BASEPATH + '/cms/GetArticleTrashList', searchParams, this.config);
  };
  getArticleById = async (articleId: number): Promise<Result<ArticleModel>> => {
    const params = new URLSearchParams({ articleId: articleId.toString() });
    return Fetch.Get<Result<ArticleModel>>(CONFIG.API_BASEPATH + `/cms/getArticleById?${params.toString()}`, this.config);
  };
  addArticle = async (article: ArticleModel): Promise<Result<ArticleModel>> => {
    return Fetch.Post<Result<ArticleModel>>(CONFIG.API_BASEPATH + '/cms/addArticle', article, this.config);
  };
  updateArticle = async (article: ArticleModel): Promise<Result<ArticleModel>> => {
    return Fetch.Post<Result<ArticleModel>>(CONFIG.API_BASEPATH + '/cms/updateArticle', article, this.config);
  };
  pinArticle = async (articleId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ articleId: articleId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/PinArticle?${params.toString()}`, this.config);
  };
  deleteArticle = async (articleId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ articleId: articleId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/DeleteArticle?${params.toString()}`, this.config);
  };
  restoreArticle = async (articleId: number): Promise<Result<null>> =>{
    const params = new URLSearchParams({ articleId: articleId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/RestoreArticle?${params.toString()}`, this.config);
  };
  removeArticle = async (articleId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ articleId: articleId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/RemoveArticle?${params.toString()}`, this.config);
  };
}
