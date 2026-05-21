import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import PageModel from '../_types/Page/PageModel';

export default class PagesService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getPageList = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<PageModel>>> => {
    return Fetch.Post<Result<PaginatedList<PageModel>>>(CONFIG.API_BASEPATH + '/cms/GetPageList', searchParams, this.config);
  };
  getPageById = async (pageId : number): Promise<Result<PageModel>> => {
    const params = new URLSearchParams({ pageId: pageId.toString() });
    return Fetch.Get<Result<PageModel>>(CONFIG.API_BASEPATH + `/cms/getPageById?${params.toString()}`, this.config);
  };
  addPage = async (page: PageModel): Promise<Result<PageModel>> => {
    return Fetch.Post<Result<PageModel>>(CONFIG.API_BASEPATH + '/cms/addPage', page, this.config);
  };
  updatePage = async (page: PageModel): Promise<Result<PageModel>> => {
    return Fetch.Post<Result<PageModel>>(CONFIG.API_BASEPATH + '/cms/updatePage', page, this.config);
  };
  deletePage = async (pageId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ pageId: pageId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/deletePage?${params.toString()}`, this.config);
  };
}
