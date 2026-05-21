import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import MessageSettingModel from '../_types/MessageSettingModel';

export default class MessageSettingService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getSettings = async (): Promise<Result<MessageSettingModel>> => {
    return Fetch.Get<Result<MessageSettingModel>>(CONFIG.API_BASEPATH + `/crm/getSettings`, this.config);
  };
  addOrUpdateSettings = async (setting: MessageSettingModel): Promise<Result<MessageSettingModel>> => {
    return Fetch.Post<Result<MessageSettingModel>>(CONFIG.API_BASEPATH + '/crm/addOrUpdateSettings', setting, this.config);
  };
}
