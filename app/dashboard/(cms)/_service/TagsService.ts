import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import GridDataBound from '@root/app/types/GridDataBound';
import TagModel from '../_types/Tag/TagModel';

export default class TagsService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getTagList = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<TagModel>>> => {
    return Fetch.Post<Result<PaginatedList<TagModel>>>(CONFIG.API_BASEPATH + '/cms/GetTagList', searchParams, this.config);
  };
  getTagListForSelect = async (): Promise<Result<TagModel[]>> => {
    return Fetch.Get<Result<TagModel[]>>(CONFIG.API_BASEPATH + `/cms/GetTagListForSelect`, this.config);
  };
  getTagById = async (tagId : number): Promise<Result<TagModel>> => {
    const params = new URLSearchParams({ tagId: tagId.toString() });
    return Fetch.Get<Result<TagModel>>(CONFIG.API_BASEPATH + `/cms/getTagById?${params.toString()}`, this.config);
  };
  addTag = async (tag: TagModel): Promise<Result<TagModel>> => {
    return Fetch.Post<Result<TagModel>>(CONFIG.API_BASEPATH + '/cms/addTag', tag, this.config);
  };
  updateTag = async (tag: TagModel): Promise<Result<TagModel>> => {
    return Fetch.Post<Result<TagModel>>(CONFIG.API_BASEPATH + '/cms/updateTag', tag, this.config);
  };
  deleteTag = async (tagId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ tagId: tagId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/deleteTag?${params.toString()}`, this.config);
  };
}
