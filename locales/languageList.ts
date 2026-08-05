import LanguageType from "@root/app/types/enums/LanguageType";
import { Language } from "./Language";

const LanguageList: Language[] = [
  {
    name: 'English',
    key: 'en',
    direction: "ltr",
    icon: '/locales/en/us.svg',
    description: 'description of the language',
    languageType: LanguageType.English,
  },
  {
    name: 'Farsi',
    key: 'fa',
    direction: "rtl",
    icon: '/locales/fa/ir.svg',
    description: 'description of the language',
    languageType: LanguageType.Persian
  },
  {
    name: 'Arabic',
    key: 'ar',
    direction: "rtl",
    icon: '/locales/ar/sy.svg',
    description: 'description of the language',
    languageType: LanguageType.Arabic
  }
];
export default LanguageList;
