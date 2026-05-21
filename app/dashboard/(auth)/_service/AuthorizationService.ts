import CONFIG from '@root/config';
import Fetch from '@root/utils/Fetch';

export default class AuthorizationService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  isAuthorized = async (permission: any) => {
    return new Promise((resolve, reject) => {
      this.getUserPermissions()
        .then((permissions: any) => {
          let result = permissions?.findIndex(function (element: any) {
            return element === permission;
          });
          resolve(result >= 0);
        })
        .catch((error) => {

          reject(new Error('Permission check failed'));
        });
    });
  };
  getUserPermissions() {
    return Fetch.Get<string[]>(CONFIG.API_BASEPATH + `/auth/GetPermissionsOfCurrentUser`, this.config);
  }
  getJwtSecretKey() {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
    if (!secret) {
      throw new Error("JWT Secret key is not matched");
    }
    return new TextEncoder().encode(secret);
  }
}
