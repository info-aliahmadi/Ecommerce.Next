'use client';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import nextIntlService from '@root/locales/nextIntlService';
import Fetch from '@root/utils/Fetch';
import { Language } from './Language';
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
        return this.getDefaultLanguage();
      }
    });
  };

  setCurrentLanguage = async (lang: Language): Promise<Result<null>> => {
    const params = new URLSearchParams({ defaultLanguage: lang.languageType.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/auth/SetDefaultLanguage?${params.toString()}`, this.config);
  };

  getSavedLanguage = () => {
    let currentLang = nextIntlService.getNextIntlLocale();
    if (currentLang == undefined || currentLang == null) {
      return CONFIG.DEFAULT_LANGUAGE;
    }
    return currentLang
  };
  getDefaultLanguage = async () => {
    return CONFIG.DEFAULT_LANGUAGE;
  };

}
