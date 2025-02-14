import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';

export default class FileStorageService {
  constructor(jwt: string) {
    setDefaultHeader(jwt);
  }
  getFilesList = async (): Promise<Result<FileUploadModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/FileStorage/GetFilesList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getDirectoriesList = async (): Promise<Result<DirectoryModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/FileStorage/GetDirectories')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getFilesListByDirectory = async (directory: string): Promise<Result<FileUploadModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/FileStorage/GetFilesByDirectory', { params: { directoryName: directory } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getFileInfoById = async (fileId: number): Promise<Result<FileUploadModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/FileStorage/GetFileInfo', { params: { fileId: fileId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getFilesInfoById = async (fileIds: number[]): Promise<Result<FileUploadModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/FileStorage/GetFilesInfo', fileIds)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getFileInfoByName = async (fileName: string): Promise<Result<FileUploadModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/FileStorage/GetFileInfoByName', { params: { fileName: fileName } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  uploadFile = async (file : any, uploadAction : any) : Promise<Result<FileUploadModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/FileStorage/UploadFile', file, {
          headers: {
            UploadAction: uploadAction,
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  uploadBase64File = async (file : any, uploadAction : any) : Promise<Result<FileUploadModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/FileStorage/UploadBase64File', file, {
          headers: {
            UploadAction: uploadAction
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  uploadLargeFile = async (file: any, uploadAction: any): Promise<Result<FileUploadModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/FileStorage/UploadLargeFile', file, {
          headers: {
            UploadAction: uploadAction
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteFile = async (fileId: number): Promise<Result<boolean>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/FileStorage/DeleteFile', { params: { fileId: fileId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
