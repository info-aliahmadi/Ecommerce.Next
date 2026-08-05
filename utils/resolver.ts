import LanguageType from "@root/app/types/enums/LanguageType";
import ThemeType from "@root/app/types/enums/ThemeType";
import CONFIG from "@root/config";
import { Language, Locale } from "@root/locales/Language";
import LanguageList from "@root/locales/LanguageList";

export function resolveThemeMode(theme: ThemeType): 'light' | 'dark' {
  return theme === ThemeType.Dark ? 'dark' : 'light';
};

export function resolveLanguageType(languageType: LanguageType): Locale {
  return LanguageList.find((l) => l.languageType === languageType)?.key ?? (LanguageList.find((l) => l.languageType === CONFIG.DEFAULT_LANGUAGE) as Language).key;
};

export function resolveLanguage(languageType: LanguageType): Language {
  return LanguageList.find((l) => l.languageType === languageType) ?? LanguageList.find((l) => l.languageType === CONFIG.DEFAULT_LANGUAGE) as Language;
};

export function resolveLocale(locale: Locale): Language {
  return LanguageList.find((l) => l.key === locale) ?? LanguageList.find((l) => l.languageType === CONFIG.DEFAULT_LANGUAGE) as Language;
};