import LanguageType from "@root/app/types/enums/LanguageType";
import { Language } from "./Language";

const languageList: Language[] = [
  {
    name: 'English',
    key: 'en',
    rtl: false,
    icon: '/locales/en/us.svg',
    description: 'description of the language',
    languageType: LanguageType.English
  },
  {
    name: 'Farsi',
    key: 'fa',
    rtl: true,
    icon: '/locales/fa/ir.svg',
    description: 'description of the language',
    languageType: LanguageType.Persian
  },
  {
    name: 'Arabic',
    key: 'ar',
    rtl: true,
    icon: '/locales/ar/sy.svg',
    description: 'description of the language',
    languageType: LanguageType.Arabic
  }
];
export default languageList;
