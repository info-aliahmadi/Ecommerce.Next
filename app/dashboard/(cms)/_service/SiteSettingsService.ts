import axios from 'axios';
import CONFIG from '@root/config';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import Result from '@root/app/types/Result';

export default class SiteSettingsService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getSettings = async (): Promise<Result<SiteSettingsModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/getSettings')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addOrUpdateSettings = async (setting: SiteSettingsModel): Promise<Result<SiteSettingsModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/addOrUpdateSettings', setting)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
