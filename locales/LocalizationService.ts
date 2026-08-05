'use client';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import Fetch from '@root/utils/Fetch';
import LanguageType from '@root/app/types/enums/LanguageType';


export default class LocalizationService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getCurrentLanguage = async (): Promise<LanguageType> => {
    return Fetch.Get<LanguageType>(CONFIG.API_BASEPATH + `/auth/GetDefaultLanguage`, this.config).then((response) => {
      if (response) {
        return response;
      } else {
        return CONFIG.DEFAULT_LANGUAGE;
      }
    });
  };

  setCurrentLanguage = async (languageType: LanguageType): Promise<Result<null>> => {
    const params = new URLSearchParams({ defaultLanguage: languageType.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/auth/SetDefaultLanguage?${params.toString()}`, this.config);
  };

}
