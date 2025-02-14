import axios from 'axios';
import CONFIG from '@root/config';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import Result from '@root/app/types/Result';

export default class LinkSectionService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getLinkSectionList = async (): Promise<Result<LinkSectionModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/GetLinkSectionList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getLinkSectionById = async (linkSectionId: number): Promise<Result<LinkSectionModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/getLinkSectionById', { params: { linkSectionId: linkSectionId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addLinkSection = async (linkSection: LinkSectionModel): Promise<Result<LinkSectionModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/addLinkSection', linkSection)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateLinkSection = async (linkSection: LinkSectionModel): Promise<Result<LinkSectionModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/updateLinkSection', linkSection)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  visibleLinkSection = async (linkSectionId: number): Promise<Result<LinkSectionModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/VisibleLinkSection', { params: { linkSectionId: linkSectionId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteLinkSection = async (linkSectionId: number): Promise<Result<LinkSectionModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/deleteLinkSection', { params: { linkSectionId: linkSectionId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
