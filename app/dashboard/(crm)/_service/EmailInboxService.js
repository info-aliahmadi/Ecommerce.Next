import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';

export default class EmailInboxService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  loadEmailInbox = async () => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/LoadEmailInbox')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        }).finally((response) => {
          resolve(response);
        });
    });
  };

  getAllEmailInbox = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<RoleModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetAllEmailInbox', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getEmailInboxOfCurrentUser = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<RoleModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetEmailInbox', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getDeletedEmailInbox = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<RoleModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetDeletedEmailInbox', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getEmailInboxById = async (emailInboxId : number): Promise<Result<RoleModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/GetEmailInboxById', { params: { emailInboxId: emailInboxId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };


  getEmailInboxByIdForReceiver = async (emailInboxId : number): Promise<Result<RoleModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/GetEmailInboxByIdForReceiver', { params: { emailInboxId: emailInboxId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteEmailInbox = async (emailInboxId : number): Promise<Result<RoleModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/DeleteEmailInbox', { params: { emailInboxId: emailInboxId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  pinEmailInbox = async (emailInboxId : number): Promise<Result<RoleModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/PinEmailInbox', { params: { emailInboxId: emailInboxId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  readEmailInbox = async (emailInboxId : number): Promise<Result<RoleModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/ReadEmailInbox', { params: { emailInboxId: emailInboxId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  removeEmailInbox = async (emailInboxId : number): Promise<Result<RoleModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/RemoveEmailInbox', { params: { emailInboxId: emailInboxId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };


}
