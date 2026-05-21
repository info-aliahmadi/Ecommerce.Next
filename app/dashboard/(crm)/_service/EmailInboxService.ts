import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import CONFIG from '@root/config';
import EmailInboxModel from '../_types/EmailInboxModel';

export default class EmailInboxService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  loadEmailInbox = async (): Promise<Result<null>> => {
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/LoadEmailInbox`, this.config);
  };

  getAllEmailInbox = async (searchParams: GridDataBound): Promise<Result<PaginatedList<EmailInboxModel>>> => {
    return Fetch.Post<Result<PaginatedList<EmailInboxModel>>>(CONFIG.API_BASEPATH + '/crm/GetAllEmailInbox', searchParams, this.config);
  };
  getEmailInboxOfCurrentUser = async (searchParams: GridDataBound): Promise<Result<PaginatedList<EmailInboxModel>>> => {
    return Fetch.Post<Result<PaginatedList<EmailInboxModel>>>(CONFIG.API_BASEPATH + '/crm/GetEmailInbox', searchParams, this.config);
  };
  getDeletedEmailInbox = async (searchParams: GridDataBound): Promise<Result<PaginatedList<EmailInboxModel>>> => {
    return Fetch.Post<Result<PaginatedList<EmailInboxModel>>>(CONFIG.API_BASEPATH + '/crm/GetDeletedEmailInbox', searchParams, this.config);
  };

  getEmailInboxById = async (emailInboxId: number): Promise<Result<EmailInboxModel>> => {
    const params = new URLSearchParams({ emailInboxId: emailInboxId.toString() });
    return Fetch.Get<Result<EmailInboxModel>>(CONFIG.API_BASEPATH + `/crm/GetEmailInboxById?${params.toString()}`, this.config);
  };


  getEmailInboxByIdForReceiver = async (emailInboxId: number): Promise<Result<EmailInboxModel>> => {
    const params = new URLSearchParams({ emailInboxId: emailInboxId.toString() });
    return Fetch.Get<Result<EmailInboxModel>>(CONFIG.API_BASEPATH + `/crm/GetEmailInboxByIdForReceiver?${params.toString()}`, this.config);
  };
  deleteEmailInbox = async (emailInboxId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ emailInboxId: emailInboxId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/DeleteEmailInbox?${params.toString()}`, this.config);
  };
  pinEmailInbox = async (emailInboxId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ emailInboxId: emailInboxId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/PinEmailInbox?${params.toString()}`, this.config);

  };
  readEmailInbox = async (emailInboxId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ emailInboxId: emailInboxId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/ReadEmailInbox?${params.toString()}`, this.config);
  };
  removeEmailInbox = async (emailInboxId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ emailInboxId: emailInboxId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/RemoveEmailInbox?${params.toString()}`, this.config);
  };
  restoreEmailInbox = async (emailInboxId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ emailInboxId: emailInboxId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/RestoreEmailInbox?${params.toString()}`, this.config);
  };
}
