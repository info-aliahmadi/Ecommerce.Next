import CONFIG from '@root/config';
import { formatDistanceToNow } from 'date-fns';
import moment from 'moment';
import { enUS, faIR, ar } from 'date-fns/locale';

type DateStyle = 'short' | 'full' | 'long' | 'medium';

export const DateViewer = (
  currentLanguage: string,
  date?: Date | number | undefined,
  dateStyle?: DateStyle,
): string => {
  if (date === null || date === undefined) return '';

  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return moment(date + 'Z').format('YYYY/MM/DD');
  }

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let dateStype = dateStyle ?? (CONFIG.DATE_STYLE as DateStyle);
  return new Intl.DateTimeFormat(currentLanguage, {
    dateStyle: dateStype,
    timeZone: timeZone,
  }).format(moment(date).toDate());
};

export const DateTimeViewer = (
  currentLanguage: string,
  dateTime: Date | undefined,
): string => {
  if (dateTime === null || dateTime === undefined) return '';

  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return moment(dateTime).format('YYYY/MM/DD HH:mm');
  }

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let dateStype = CONFIG.DATE_STYLE as DateStyle;
  let timeStyle = CONFIG.TIME_STYLE as DateStyle;
  return new Intl.DateTimeFormat(currentLanguage, {
    dateStyle: dateStype,
    timeStyle: timeStyle,
    hour12: false,
    timeZone: timeZone,
  }).format(moment(dateTime).toDate());
};

export const showDistanceToNow = (date: Date, locale: string) => {
  // Only run on client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return moment(date).fromNow();
  }

  let loc;
  switch (locale) {
    case 'ar':
      loc = ar;
      break;
    case 'fa':
      loc = faIR;
      break;
    case 'en':
      loc = enUS;
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
