import axios from 'axios';
import CONFIG from '@root/config';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import Result from '@root/app/types/Result';

export default class TagsService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getTagList = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<TagModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/GetTagList', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getTagListForSelect = async (): Promise<Result<TagModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/GetTagListForSelect')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getTagById = async (tagId : number): Promise<Result<TagModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/getTagById', { params: { tagId: tagId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addTag = async (tag: TagModel): Promise<Result<TagModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/addTag', tag)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateTag = async (tag: TagModel): Promise<Result<TagModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/updateTag', tag)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteTag = async (tagId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/deleteTag', { params: { tagId: tagId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
