import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import SiteSettingsModel from '../_types/SiteSetting/SiteSettingsModel';

export default class SiteSettingsService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getSettings = async (): Promise<Result<SiteSettingsModel>> => {
    return Fetch.Get<Result<SiteSettingsModel>>(CONFIG.API_BASEPATH + `/cms/getSettings`, this.config);
  };
  addOrUpdateSettings = async (setting: SiteSettingsModel): Promise<Result<SiteSettingsModel>> => {
    return Fetch.Post<Result<SiteSettingsModel>>(CONFIG.API_BASEPATH + '/cms/addOrUpdateSettings', setting, this.config);
  };
}
