import CONFIG from '@root/config';
import { formatDistanceToNow } from 'date-fns';
import moment from 'moment';
import { enUS, faIR, ar } from 'date-fns/locale';
import LanguageType from '@root/app/types/enums/LanguageType';
import LanguageList from '@root/locales/LanguageList';

type DateStyle = 'short' | 'full' | 'long' | 'medium';
type LanguageInput = string | LanguageType;

const resolveLocale = (lang: LanguageInput): string => {
  if (typeof lang === 'string') return lang;
  return LanguageList.find((l) => l.languageType === lang)?.key ?? 'en';
};

export const DateViewer = (
  currentLanguage: LanguageInput,
  date?: Date | number | undefined | null,
  dateStyle?: DateStyle,
): string => {
  if (date === null || date === undefined) return '';

  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return moment(date + 'Z').format('YYYY/MM/DD');
  }

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let dateStype = dateStyle ?? (CONFIG.DATE_STYLE as DateStyle);
  return new Intl.DateTimeFormat(resolveLocale(currentLanguage), {
    dateStyle: dateStype,
    timeZone: timeZone,
  }).format(moment(date).toDate());
};

export const DateTimeViewer = (
  currentLanguage: LanguageInput,
  dateTime?: Date | undefined | null,
): string => {
  if (dateTime === null || dateTime === undefined) return '';

  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return moment(dateTime).format('YYYY/MM/DD HH:mm');
  }

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let dateStype = CONFIG.DATE_STYLE as DateStyle;
  let timeStyle = CONFIG.TIME_STYLE as DateStyle;
  return new Intl.DateTimeFormat(resolveLocale(currentLanguage), {
    dateStyle: dateStype,
    timeStyle: timeStyle,
    hour12: false,
    timeZone: timeZone,
  }).format(moment(dateTime).toDate());
};

export const showDistanceToNow = (locale: LanguageInput, date?: Date,) => {
  if (!date) return '';
  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return moment(date).fromNow();
  }

  const resolved = resolveLocale(locale);
  let loc;
  switch (resolved) {
    case 'ar':
      loc = ar;
      break;
    case 'fa':
      loc = faIR;
      break;
    default:
      loc = enUS;
      break;
  }
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: false,
    locale: loc,
  });
};
