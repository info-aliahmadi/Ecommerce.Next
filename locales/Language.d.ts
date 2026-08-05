import LanguageType from "@root/app/types/enums/LanguageType";

interface Language {
    name: string,
    key: Locale,
    direction: "rtl" | "ltr",
    icon: string,
    description: string,
    languageType : LanguageType
}
export type Locale = 'en' | 'fa' | 'ar';