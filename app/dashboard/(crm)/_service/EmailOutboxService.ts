import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import CONFIG from '@root/config';
import EmailOutboxModel from '../_types/EmailOutboxModel';

export default class EmailOutboxService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }
  
  getAllEmailOutbox = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<EmailOutboxModel>>> => {
    return Fetch.Post<Result<PaginatedList<EmailOutboxModel>>>(CONFIG.API_BASEPATH + '/crm/GetAllEmailOutbox', searchParams, this.config);
  };
  getEmailOutboxOfCurrentUser = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<EmailOutboxModel>>> => {
    return Fetch.Post<Result<PaginatedList<EmailOutboxModel>>>(CONFIG.API_BASEPATH + '/crm/GetEmailOutbox', searchParams, this.config);
  };

  sendEmailOutbox = async (emailOutboxModel : EmailOutboxModel): Promise<Result<EmailOutboxModel>> => {
    return Fetch.Post<Result<EmailOutboxModel>>(CONFIG.API_BASEPATH + '/crm/SendEmailOutbox', emailOutboxModel, this.config);
  };
  saveDraftEmailOutbox = async (emailOutboxModel : EmailOutboxModel): Promise<Result<EmailOutboxModel>> => {
    return Fetch.Post<Result<EmailOutboxModel>>(CONFIG.API_BASEPATH + '/crm/SaveDraftEmailOutbox', emailOutboxModel, this.config);
  };

  getAddressForSelect = async () : Promise<Result<string[]>> => {
    return Fetch.Get<Result<string[]>>(CONFIG.API_BASEPATH + `/crm/GetAddressForSelect`, this.config);
  };

  getEmailOutboxByIdForSender = async (emailOutboxId : number): Promise<Result<EmailOutboxModel>> => {
    const params = new URLSearchParams({ emailOutboxId: emailOutboxId.toString() });
    return Fetch.Get<Result<EmailOutboxModel>>(CONFIG.API_BASEPATH + `/crm/GetEmailOutboxByIdForSender?${params.toString()}`, this.config);
  };

  removeEmailOutbox = async (emailOutboxId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ emailOutboxId: emailOutboxId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/RemoveEmailOutbox?${params.toString()}`, this.config);
  };

}
