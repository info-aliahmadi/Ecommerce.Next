import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import CONFIG from '@root/config';
import MessageModel from '../_types/MessageModel';

export default class MessageService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }
  
  getAllMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return Fetch.Post<Result<PaginatedList<MessageModel>>>(CONFIG.API_BASEPATH + '/crm/GetAllMessages', searchParams, this.config);
  };
  getInboxMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return Fetch.Post<Result<PaginatedList<MessageModel>>>(CONFIG.API_BASEPATH + '/crm/GetInboxMessages', searchParams, this.config);
  };
  getSentMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return Fetch.Post<Result<PaginatedList<MessageModel>>>(CONFIG.API_BASEPATH + '/crm/GetSentMessages', searchParams, this.config);
  };
  getDraftMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return Fetch.Post<Result<PaginatedList<MessageModel>>>(CONFIG.API_BASEPATH + '/crm/GetDraftMessages', searchParams, this.config);
  };
  getPublicInboxMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return Fetch.Post<Result<PaginatedList<MessageModel>>>(CONFIG.API_BASEPATH + '/crm/GetPublicInboxMessages', searchParams, this.config);
  };
  getDeletedInboxMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return Fetch.Post<Result<PaginatedList<MessageModel>>>(CONFIG.API_BASEPATH + '/crm/GetDeletedInboxMessages', searchParams, this.config);
  };
  getDeletedSentMessages = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<MessageModel>>> => {
    return Fetch.Post<Result<PaginatedList<MessageModel>>>(CONFIG.API_BASEPATH + '/crm/GetDeletedSentMessages', searchParams, this.config);
  };

  getMessageByIdForPublic = async (messageId : number): Promise<Result<MessageModel>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<MessageModel>>(CONFIG.API_BASEPATH + `/crm/GetMessageByIdForPublic?${params.toString()}`, this.config);
  };
  getMessageByIdForSender = async (messageId : number): Promise<Result<MessageModel>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<MessageModel>>(CONFIG.API_BASEPATH + `/crm/GetMessageByIdForSender?${params.toString()}`, this.config);

  };
  getMessageByIdForReceiver = async (messageId : number): Promise<Result<MessageModel>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<MessageModel>>(CONFIG.API_BASEPATH + `/crm/GetMessageByIdForReceiver?${params.toString()}`, this.config);
  };

  deleteDraftMessage = async (messageId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/DeleteDraftMessage?${params.toString()}`, this.config);
  };
  deleteMessage = async (messageId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/DeleteMessage?${params.toString()}`, this.config);
  };
  pinMessage = async (messageId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/PinMessage?${params.toString()}`, this.config);
  };
  readMessage = async (messageId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/ReadMessage?${params.toString()}`, this.config);
  };
  restoreMessage = async (messageId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/RestoreMessage?${params.toString()}`, this.config);

  };
  removeDraftMessage = async (messageId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ messageId: messageId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/RemoveDraftMessage?${params.toString()}`, this.config);
  };

  sendPublicMessage = async (message : MessageModel): Promise<Result<MessageModel>> => {
    return Fetch.Post<Result<MessageModel>>(CONFIG.API_BASEPATH + '/crm/SendPublicMessage', message, this.config);
  };
  sendPrivateMessage = async (message : MessageModel): Promise<Result<MessageModel>> => {
    return Fetch.Post<Result<MessageModel>>(CONFIG.API_BASEPATH + '/crm/SendPrivateMessage', message, this.config);
  };
  sendRequestMessage = async (message: MessageModel): Promise<Result<MessageModel>>=> {
    return Fetch.Post<Result<MessageModel>>(CONFIG.API_BASEPATH + '/crm/SendRequestMessage', message, this.config);
  };
  sendContactMessage = async (message: MessageModel): Promise<Result<MessageModel>> => {
    return Fetch.Post<Result<MessageModel>>(CONFIG.API_BASEPATH + '/crm/SendContactMessage', message, this.config);
  };
  saveDraftMessage = async (message: MessageModel): Promise<Result<MessageModel>> => {
    return Fetch.Post<Result<MessageModel>>(CONFIG.API_BASEPATH + '/crm/SaveDraftMessage', message, this.config);
  };
}
