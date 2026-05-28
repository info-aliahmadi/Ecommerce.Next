import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import GridDataBound from '@root/app/types/GridDataBound';
import LinkModel from '../_types/Link/LinkModel';

export default class LinkService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getLinkList = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<LinkModel>>> => {
    return Fetch.Post<Result<PaginatedList<LinkModel>>>(CONFIG.API_BASEPATH + '/cms/GetLinkList', searchParams, this.config);
  };
  getLinkById = async (linkId : number): Promise<Result<LinkModel>> => {
    const params = new URLSearchParams({ linkId: linkId.toString() });
    return Fetch.Get<Result<LinkModel>>(CONFIG.API_BASEPATH + `/cms/getLinkById?${params.toString()}`, this.config);
  };
  addLink = async (link: LinkModel): Promise<Result<LinkModel>> => {
    return Fetch.Post<Result<LinkModel>>(CONFIG.API_BASEPATH + '/cms/addLink', link, this.config);
  };
  updateLink = async (link: LinkModel): Promise<Result<LinkModel>> => {
    return Fetch.Post<Result<LinkModel>>(CONFIG.API_BASEPATH + '/cms/updateLink', link, this.config);
  };

  updateLinkOrders = async (linkList: LinkModel[]): Promise<Result<LinkModel[]>> => {
    return Fetch.Post<Result<LinkModel[]>>(CONFIG.API_BASEPATH + '/cms/updateLinkOrders', linkList, this.config);
  };
  deleteLink = async (linkId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ linkId: linkId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/deleteLink?${params.toString()}`, this.config);
  };
}
