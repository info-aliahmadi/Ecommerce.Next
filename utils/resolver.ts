import LanguageType from "@root/app/types/enums/LanguageType";
import ThemeType from "@root/app/types/enums/ThemeType";
import languageList from "@root/locales/languageList";

export function resolveThemeMode(theme: ThemeType): 'light' | 'dark' {
  return theme === ThemeType.Dark ? 'dark' : 'light';
};

export function resolveLanguage(languageType: LanguageType): string {
  return languageList.find((l) => l.languageType === languageType)?.key ?? 'en';
};