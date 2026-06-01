import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import DirectoryModel from '../_types/DirectoryModel';
import FileUploadModel from '../_types/FileUploadModel';

export default class FileStorageService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getFilesList = async (): Promise<Result<FileUploadModel[]>> => {
    return Fetch.Get<Result<FileUploadModel[]>>(CONFIG.API_BASEPATH + `/FileStorage/GetFilesList`, this.config);
  };

  getDirectoriesList = async (): Promise<Result<DirectoryModel[]>> => {
    return Fetch.Get<Result<DirectoryModel[]>>(CONFIG.API_BASEPATH + `/FileStorage/GetDirectories`, this.config);
  };
  getFilesListByDirectory = async (directory: string): Promise<Result<FileUploadModel[]>> => {
    const params = new URLSearchParams({ directory: directory.toString() });
    return Fetch.Get<Result<FileUploadModel[]>>(CONFIG.API_BASEPATH + `/FileStorage/GetFilesByDirectory?${params.toString()}`, this.config);

  };
  getFileInfoById = async (fileId: number): Promise<Result<FileUploadModel>> => {
    const params = new URLSearchParams({ fileId: fileId.toString() });
    return Fetch.Get<Result<FileUploadModel>>(CONFIG.API_BASEPATH + `/FileStorage/GetFileInfo?${params.toString()}`, this.config);
  };
  getFilesInfoById = async (fileIds: number[]): Promise<Result<FileUploadModel[]>> => {
    return Fetch.Post<Result<FileUploadModel[]>>(CONFIG.API_BASEPATH + '/FileStorage/GetFilesInfo', fileIds, this.config);
  };
  getFileInfoByName = async (fileName: string): Promise<Result<FileUploadModel>> => {
    const params = new URLSearchParams({ fileName: fileName.toString() });
    return Fetch.Get<Result<FileUploadModel>>(CONFIG.API_BASEPATH + `/FileStorage/GetFileInfoByName?${params.toString()}`, this.config);
  };
  uploadFile = async (file: any, uploadAction: any): Promise<Result<FileUploadModel>> => {
    const headers = { ...(this.config?.headers as Record<string, string>) };
    delete headers['Content-Type'];
    delete headers['content-type'];

    let config: RequestInit = {
      headers: {
        ...headers,
        UploadAction: uploadAction
      }
    };
    return Fetch.Post<Result<FileUploadModel>>(CONFIG.API_BASEPATH + '/FileStorage/UploadFile', file, config);
  };
  uploadBase64File = async (file: any, uploadAction: any): Promise<Result<FileUploadModel>> => {
    let config: RequestInit = {
      headers: {
        ...this.config?.headers,
        UploadAction: uploadAction
      }
    };
    return Fetch.Post<Result<FileUploadModel>>(CONFIG.API_BASEPATH + '/FileStorage/UploadBase64File', file, config);
  };
  uploadLargeFile = async (file: any, uploadAction: any): Promise<Result<FileUploadModel>> => {
    let config: RequestInit = {
      headers: {
        ...this.config?.headers,
        UploadAction: uploadAction
      }
    };
    return Fetch.Post<Result<FileUploadModel>>(CONFIG.API_BASEPATH + '/FileStorage/UploadLargeFile', file, config);
  };
  deleteFile = async (fileId: number): Promise<Result<boolean>> => {
    const params = new URLSearchParams({ fileId: fileId.toString() });
    return Fetch.Get<Result<boolean>>(CONFIG.API_BASEPATH + `/FileStorage/DeleteFile?${params.toString()}`, this.config);
  };
}
