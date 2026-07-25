import LanguageType from "@root/app/types/enums/LanguageType";

interface Language {
    name: string,
    key: string,
    rtl: boolean,
    icon: string,
    description: string,
    rtl: boolean,
    languageType : LanguageType
}