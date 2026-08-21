'use client'
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
// Import the plugin code
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginGetFile from 'filepond-plugin-get-file';
registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType, // Image editor
  FilePondPluginImagePreview,
  FilePondPluginFilePoster,
  FilePondPluginGetFile
);
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import 'filepond-plugin-get-file/dist/filepond-plugin-get-file.css';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
import FileStorageService from '@dashboard/(filestorage)/_service/FileStorageService';
import { useSession } from 'next-auth/react';
import { FileOrigin, FilePondFile, FilePondInitialFile } from 'filepond';
import FileUploadModel from '../../(filestorage)/_types/FileUploadModel';
import { GetImage } from '@root/app/(home)/_lib/utils';

interface FileUploadProps {
  id?: string;
  name: string;
  setFieldValue?: (field: string, value: any) => void;
  value?: any;
  minFileSize?: string;
  maxFileSize?: string;
  disabled?: boolean;
  filePosterMaxHeight?: number;
  allowMultiple?: boolean;
}

export default function FileUpload({
  id,
  name,
  setFieldValue,
  value,
  minFileSize,
  maxFileSize,
  disabled,
  filePosterMaxHeight,
  allowMultiple
}: Readonly<FileUploadProps>) {
  const [files, setFiles] = useState<Array<FilePondInitialFile | Blob | string>>([]);
  const [values, setValues] = useState<any[]>([]);
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const uploadUrl = CONFIG.API_BASEPATH + '/FileStorage/UploadFile';

  var fileUploadService = new FileStorageService(jwt ?? '');

  const loadFiles = async (fileIds: number[]) => {
    fileUploadService.getFilesInfoById(fileIds).then((fileInfos) => {
      let fileInfosData: FilePondInitialFile[] = [];
      fileInfos.data && fileInfos.data.forEach((fileInfo: FileUploadModel) => {
        let fileUrl = GetImage(fileInfo);
        const isVideo = CONFIG.VIDEOS_EXTENSIONS.includes(fileInfo.extension);
        const posterUrl = isVideo && GetImage(fileInfo, true);

        fileInfosData.push({
          // the server file reference
          source: fileInfo.id.toString(),
          // set type to local to indicate an already uploaded file
          options: {
            type: 'local',
            // optional stub file information
            file: {
              name: fileInfo.fileName,
              type: isVideo ? 'video/*' : 'image/*',
              size: fileInfo.size
            },
            // pass poster property
            metadata: {
              poster: posterUrl,
              url: fileUrl
            }
          }
        });
      });
      setFiles(fileInfosData);
    });
  };
  const loadFile = async (fileId: number) => {
    fileUploadService.getFileInfoById(fileId).then((result) => {
      let fileInfo = result.data;
      if (fileInfo != undefined) {
        let fileUrl = GetImage(fileInfo);
        const isVideo = CONFIG.VIDEOS_EXTENSIONS.includes(fileInfo.extension);
        const posterUrl = isVideo && GetImage(fileInfo, true);
        setFiles([
          {
            // the server file reference
            source: fileInfo.id.toString(),
            // set type to local to indicate an already uploaded file
            options: {
              type: 'local',
              // optional stub file information
              file: {
                name: fileInfo.fileName,
                type: isVideo ? 'video/*' : 'image/*',
                size: fileInfo.size
              },
              // pass poster property
              metadata: {
                poster: posterUrl,
                url: fileUrl
              }
            }
          }
        ]);
      }
    });
  };

  useEffect(() => {
    if (allowMultiple) {
      if (value != undefined && value.length > 0) {
        loadFiles(value);
      } else {
        setFiles([]);
      }
    } else {
      if (value > 0) {
        loadFile(value);
      } else {
        setFiles([]);
      }
    }
  }, [value]);

  function downloadFunction(item: any) {
    // create a temporary hyperlink to force the browser to download the file
    const a = document.createElement('a');
    let url;
    if (item.source > 0) {
      window.open(item.file.url);
      return;
      // url = item.file.url;
    } else {
      url = window.URL.createObjectURL(item.file);
    }
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = item.file.name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  const onupdatefiles = async (fileItems: FilePondFile[]) => {
    let fileInfosData: Array<FilePondInitialFile | Blob | string> = [];
    fileItems.forEach(fileInfo => {
      if (fileInfo.origin === FileOrigin.LOCAL) {
        fileInfosData.push({
          // the server file reference
          source: fileInfo.source.toString(),
          // set type to local to indicate an already uploaded file
          options: {
            type: 'local',
            // optional stub file information
            file: {
              name: fileInfo.filename,
              type: fileInfo.fileType,
              size: fileInfo.fileSize
            },
            // pass poster property
            metadata: {
              poster: fileInfo.getMetadata('poster'),
              url: fileInfo.getMetadata('url')
            }
          }
        });
      } else {
        fileInfosData.push(fileInfo.file);
      }
    });
    setFiles(fileInfosData);
  };
  function beforeRemoveFile(file?: FilePondFile): boolean | Promise<boolean> {
    if (setFieldValue != undefined && file != undefined) {
      let fileId: number | undefined = parseInt(file.serverId) ?? undefined;
      if (fileId != undefined) {
        fileUploadService.deleteFile(fileId).then((result) => {
          if (result.succeeded) {
            setFieldValue(name, undefined);
            setValues([]);
          }
          return result.succeeded;
        });
        if (allowMultiple) {
          let newValue = values;
          const index = newValue.indexOf(fileId);
          newValue.splice(index, 1);
          setFieldValue(name, newValue);
          setValues(newValue);
        } else {
          setFieldValue(name, fileId);
          return true;
        }
      }
    }
    return false;
  }
  function onprocessfile(error: any, file: FilePondFile) {
    if (setFieldValue != undefined && file != undefined) {
      let response = JSON.parse(file?.serverId);
      if (response?.succeeded) {
        let fileInfo = response?.data;
        if (allowMultiple) {
          let newValues = values;
          newValues.push(fileInfo?.id);

          if (setFieldValue != undefined)
            setFieldValue(name, newValues);
          setValues((old) => [...old, fileInfo?.id]);
        } else {
          if (setFieldValue != undefined)
            setFieldValue(name, fileInfo?.id);
        }
      }
    }
  }
  const getError = (errorCode: number) => {
    switch (errorCode) {
      case 500:
        return 'Operation Failed';
      case 501:
        return 'Invalid Validation';
      case 404:
        return 'Not Found';
      case 401:
        return 'Is Not Authorized';
      case 502:
        return 'File Type Is Not Allowed';
      case 503:
        return 'It"s Duplicate';
      case 504:
        return 'Exception Throwed';
      case 505:
        return 'File Is Too Large';
      case 506:
        return 'File Is Too Small';
      default:
        return 'Error During Upload';
    }
  }
  return (
    <FilePond
      disabled={disabled}
      id={id ?? 'fileId'}
      allowImagePreview={true}
      filePosterMaxHeight={filePosterMaxHeight ?? undefined}
      allowDownloadByUrl={true}
      //downloadFunction={downloadFunction}
      beforeRemoveFile={beforeRemoveFile}
      allowFilePoster={true}
      allowFileTypeValidation={true}
      // acceptedFileTypes={['image/png', 'image/jpeg', 'video/*']}
      labelFileTypeNotAllowed={"نوع فایل مجاز نیست"}
      fileValidateTypeLabelExpectedTypes={"انتظار می‌رود {allButLastType} یا {lastType}"}
      allowFileSizeValidation={true}
      minFileSize={minFileSize ? minFileSize : '5KB'}
      maxFileSize={maxFileSize ? maxFileSize : '200MB'}
      labelMaxFileSizeExceeded={"فایل خیلی بزرگ است"}
      labelMaxFileSize={"حداکثر اندازه فایل {filesize} است"}
      labelMinFileSizeExceeded={"فایل خیلی کوچک است"}
      labelMinFileSize={"حداقل اندازه فایل {filesize} است"}
      labelIdle={"فایل‌های خود را بکشید و رها کنید یا <span class='filepond--label-action'>مرور کنید</span>"}
      instantUpload={true}
      allowMultiple={(allowMultiple && true) ?? false}
      credits={false}
      name="file" /* sets the multipart form field expected by the API */
      files={files}
      onupdatefiles={onupdatefiles}
      server={{
        url: uploadUrl,
        headers: { Authorization: 'Bearer ' + jwt, UploadAction: 'Rename' }
      }}
      onprocessfile={onprocessfile}
      labelFileProcessingError={(error: any) => getError(error.code)}
    />);
}
