import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import LinkSectionModel from '../_types/LinkSection/LinkSectionModel';

export default class LinkSectionService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getLinkSectionList = async (): Promise<Result<LinkSectionModel[]>> => {
    return Fetch.Get<Result<LinkSectionModel[]>>(CONFIG.API_BASEPATH + `/cms/GetLinkSectionList`, this.config);
  };
  getLinkSectionById = async (linkSectionId: number): Promise<Result<LinkSectionModel>> => {
    const params = new URLSearchParams({ linkSectionId: linkSectionId.toString() });
    return Fetch.Get<Result<LinkSectionModel>>(CONFIG.API_BASEPATH + `/cms/getLinkSectionById?${params.toString()}`, this.config);
  };
  addLinkSection = async (linkSection: LinkSectionModel): Promise<Result<LinkSectionModel>> => {
    return Fetch.Post<Result<LinkSectionModel>>(CONFIG.API_BASEPATH + '/cms/addLinkSection', linkSection, this.config);
  };
  updateLinkSection = async (linkSection: LinkSectionModel): Promise<Result<LinkSectionModel>> => {
    return Fetch.Post<Result<LinkSectionModel>>(CONFIG.API_BASEPATH + '/cms/updateLinkSection', linkSection, this.config);
  };

  visibleLinkSection = async (linkSectionId: number): Promise<Result<LinkSectionModel>> => {
    const params = new URLSearchParams({ linkSectionId: linkSectionId.toString() });
    return Fetch.Get<Result<LinkSectionModel>>(CONFIG.API_BASEPATH + `/cms/VisibleLinkSection?${params.toString()}`, this.config);
  };
  deleteLinkSection = async (linkSectionId: number): Promise<Result<LinkSectionModel>> => {
    const params = new URLSearchParams({ linkSectionId: linkSectionId.toString() });
    return Fetch.Get<Result<LinkSectionModel>>(CONFIG.API_BASEPATH + `/cms/deleteLinkSection?${params.toString()}`, this.config);
  };
}
