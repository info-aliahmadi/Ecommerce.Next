// ==============================|| THEME CONFIG  ||============================== //
const CONFIG : CONFIG = {
  APP_VERSION: '1.2',
  DEFAULT_PATH: '/',
  MINIDRAWER: true,
  CONTAINER: true,
  DASHBOARD_FONT_FAMILY: `'Public Sans', sans-serif`,
  DASHBOARD_DEFAULT_THEME_MODE: 'light',
  DASHBOARD_THEME_MODE_STORAGE_NAME: 'HydraThemeMode',
  PRESET_COLOR: 'default',
  DOMAIN: 'http://localhost:3000',
  API_BASEPATH: 'https://localhost:7134' , // application api basepath
  AVATAR_BASEPATH: 'https://localhost:7134/avatar/',
  UPLOAD_BASEPATH:  'https://localhost:7134/',
  IMAGES_EXTENSIONS: ['.jpg', '.jpeg', '.tiff', '.tif', '.gif', '.bmp', '.png'],
  VIDEOS_EXTENSIONS: ['.mp4', '.h264', '.wmv', '.wav', '.avi', '.flv', '.mov', '.mkv', '.webm', '.ogg'],
  LOGIN_API_PATH:  'https://localhost:7134/Auth/Login',
  REFRESH_TOKEN_API_PATH: 'https://localhost:7134/Auth/RefreshToken',
  LOGOUT_API_PATH: 'https://localhost:7134/Auth/SignOut',
  FRONT_PATH: 'http://localhost:3000',
  DASHBOARD_PATH: 'http://localhost:3000/dashboard',
  LOGIN_PATH: 'http://localhost:3000/api/auth/signin',

  AUTHENTICATION_DEFAULT_STORAGE: 'localStorage',
  AUTHENTICATION_STORAGE_NAME: 'HydraAuthenticationStorage',
  AUTHORIZATION_STORAGE_NAME: 'HydraAuthorizationStorage',
  LANGUAGE_STORAGE_NAME: 'i18nextLng',
  DEFAULT_LANGUAGE: 'en',
  DATE_STYLE: "short",
  TIME_STYLE: 'short', 
  LTR_FONTS_EDITOR: ['"Public Sans"', 'Arial', 'tohoma', 'Courier New,Courier'],
  RTL_FONTS_EDITOR: ['Iran Sans', 'Arial', 'tohoma', 'Courier New,Courier']
};

export default CONFIG;

export const drawerWidth = 260;

export const drawerMinimizeWidth = 60;

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

interface CONFIG{
  APP_VERSION: string,
  DEFAULT_PATH: string,
  MINIDRAWER: true,
  CONTAINER: true,
  DASHBOARD_FONT_FAMILY: string,
  DASHBOARD_DEFAULT_THEME_MODE: 'light' | 'dark',
  DASHBOARD_THEME_MODE_STORAGE_NAME: string,
  PRESET_COLOR: string,
  DOMAIN: string,
  API_BASEPATH: string , // application api basepath
  AVATAR_BASEPATH: string,
  UPLOAD_BASEPATH:  string,
  IMAGES_EXTENSIONS: string[],
  VIDEOS_EXTENSIONS: string[],
  LOGIN_API_PATH:  string,
  REFRESH_TOKEN_API_PATH: string,
  LOGOUT_API_PATH: string,
  FRONT_PATH: string,
  DASHBOARD_PATH: string,
  LOGIN_PATH: string,

  AUTHENTICATION_DEFAULT_STORAGE: 'localStorage' | 'cookie' ,
  AUTHENTICATION_STORAGE_NAME: string,
  AUTHORIZATION_STORAGE_NAME: string,
  LANGUAGE_STORAGE_NAME: string,
  DEFAULT_LANGUAGE: string,
  DATE_STYLE: "full" | "long" | "medium" | "short",
  TIME_STYLE: "full" | "long" | "medium" | "short"
  LTR_FONTS_EDITOR: string[],
  RTL_FONTS_EDITOR: string[]
}