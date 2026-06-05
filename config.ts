import CurrencyTypes from "./app/types/enums/CurrencyTypes";

// ==============================|| THEME CONFIG  ||============================== //
const CONFIG = {
  APP_VERSION: '1.2',
  APP_HEADER: 'Hydra Cashier App',
  DEFAULT_PATH: '/',
  MINIDRAWER: true,
  CONTAINER: true,
  DASHBOARD_DEFAULT_THEME_MODE: 'light',
  DASHBOARD_THEME_MODE_STORAGE_NAME: 'HydraThemeMode',
  PRESET_COLOR: 'default',
  DOMAIN: process.env.NEXT_PUBLIC_FRONT_URL,
  API_BASEPATH: process.env.NEXT_PUBLIC_API_BASE_URL, // application api basepath
  UNKNOWN_IMAGE_BASEPATH: `${process.env.NEXT_PUBLIC_FRONT_URL}/images/unknown.png`,
  UNKNOWN_USER_BASEPATH: `${process.env.NEXT_PUBLIC_FRONT_URL}/images/users/anonymous.png`,
  AVATAR_BASEPATH: `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`,
  PRODUCT_BASEPATH: `${process.env.NEXT_PUBLIC_API_BASE_URL}/productimage/`,
  CATEGORY_BASEPATH: `${process.env.NEXT_PUBLIC_API_BASE_URL}/categoryimage/`,
  UPLOAD_BASEPATH:  `${process.env.NEXT_PUBLIC_API_BASE_URL}/`,
  IMAGES_EXTENSIONS: ['.jpg', '.jpeg', '.tiff', '.tif', '.gif', '.bmp', '.png'],
  VIDEOS_EXTENSIONS: ['.mp4', '.h264', '.wmv', '.wav', '.avi', '.flv', '.mov', '.mkv', '.webm', '.ogg'],
  LOGIN_API_PATH: `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/Login`,
  REFRESH_TOKEN_API_PATH: `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/RefreshToken`,
  LOGOUT_API_PATH: `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/SignOut`,
  FRONT_PATH: process.env.NEXT_PUBLIC_FRONT_URL ,
  DASHBOARD_PATH: `${process.env.NEXT_PUBLIC_FRONT_URL}/dashboard/`,
  LOGIN_PATH:  `${process.env.NEXT_PUBLIC_FRONT_URL}/login`,

  AUTHENTICATION_DEFAULT_STORAGE: 'localStorage', //'cookie',
  AUTHENTICATION_STORAGE_NAME: 'HydraAuthenticationStorage',
  AUTHORIZATION_STORAGE_NAME: 'HydraAuthorizationStorage',
  LANGUAGE_STORAGE_NAME: 'NEXT_LOCALE',
  DEFAULT_LANGUAGE: 'fa',
  DEFAULT_CURRENCY: CurrencyTypes.Toman,
  DATE_STYLE: "short", // "full" | "long" | "medium" | "short",
  TIME_STYLE: 'short', // "full" | "long" | "medium" | "short"
  LTR_FONTS_EDITOR: '"Poppins", Arial, tohoma',
  RTL_FONTS_EDITOR: '"Iran Sans", Arial, tohoma'
};

export default CONFIG;

export const drawerWidth = 260;

export const drawerMinimizeWidth = 60;

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';
