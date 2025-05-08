import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import MessageSettingModel from '../_types/MessageSettingModel';

export default class MessageSettingService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getSettings = async (): Promise<Result<MessageSettingModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/getSettings')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addOrUpdateSettings = async (setting : MessageSettingModel) => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/addOrUpdateSettings', setting)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

}
