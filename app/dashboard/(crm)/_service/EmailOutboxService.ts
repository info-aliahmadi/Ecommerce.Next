import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import EmailOutboxModel from '../_types/EmailOutboxModel';

export default class EmailOutboxService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }

  sendEmailOutbox = async (emailOutboxModel : EmailOutboxModel): Promise<Result<EmailOutboxModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/SendEmailOutbox', emailOutboxModel)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  saveDraftEmailOutbox = async (emailOutboxModel : EmailOutboxModel): Promise<Result<EmailOutboxModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/SaveDraftEmailOutbox', emailOutboxModel)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAllEmailOutbox = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<EmailOutboxModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetAllEmailOutbox', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getEmailOutboxOfCurrentUser = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<EmailOutboxModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetEmailOutbox', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAddressForSelect = async () : Promise<Result<string[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/GetAddressForSelect')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getEmailOutboxByIdForSender = async (emailOutboxId : number): Promise<Result<EmailOutboxModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/GetEmailOutboxByIdForSender', { params: { emailOutboxId: emailOutboxId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  removeEmailOutbox = async (emailOutboxId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/RemoveEmailOutbox', { params: { emailOutboxId: emailOutboxId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

}
