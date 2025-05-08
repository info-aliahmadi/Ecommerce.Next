import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import MessageModel from '../_types/MessageModel';

export default class MessageService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getAllMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetAllMessages', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getInboxMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetInboxMessages', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getSentMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetSentMessages', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getDraftMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetDraftMessages', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getPublicInboxMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetPublicInboxMessages', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getDeletedInboxMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetDeletedInboxMessages', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getDeletedSentMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/GetDeletedSentMessages', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getMessageByIdForPublic = async (messageId : number): Promise<Result<MessageModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/GetMessageByIdForPublic', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getMessageByIdForSender = async (messageId : number): Promise<Result<MessageModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/GetMessageByIdForSender', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getMessageByIdForReceiver = async (messageId : number): Promise<Result<MessageModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/GetMessageByIdForReceiver', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  deleteDraftMessage = async (messageId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/DeleteDraftMessage', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteMessage = async (messageId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/DeleteMessage', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  pinMessage = async (messageId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/PinMessage', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  readMessage = async (messageId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/ReadMessage', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  restoreMessage = async (messageId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/RestoreMessage', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  removeDraftMessage = async (messageId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/crm/RemoveDraftMessage', { params: { messageId: messageId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  sendPublicMessage = async (message : MessageModel): Promise<Result<MessageModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/SendPublicMessage', message)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  sendPrivateMessage = async (message : MessageModel): Promise<Result<MessageModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/SendPrivateMessage', message)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  sendRequestMessage = async (message: MessageModel): Promise<Result<MessageModel>>=> {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/SendRequestMessage', message)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  sendContactMessage = async (message: MessageModel): Promise<Result<MessageModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/SendContactMessage', message)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  saveDraftMessage = async (message: MessageModel): Promise<Result<MessageModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/crm/SaveDraftMessage', message)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
