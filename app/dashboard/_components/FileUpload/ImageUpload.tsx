'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginGetFile from 'filepond-plugin-get-file';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import 'filepond-plugin-get-file/dist/filepond-plugin-get-file.css';

import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
import { useSession } from 'next-auth/react';
import { FileOrigin, FilePondFile, FilePondInitialFile } from 'filepond';
import FileStorageService from '@dashboard/(filestorage)/_service/FileStorageService';
import FileUploadModel from '@dashboard/(filestorage)/_types/FileUploadModel';

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFilePoster,
  FilePondPluginGetFile
);

interface ImageUploadProps {
  name: string;
  setFieldValue?: (field: string, value: any) => void;
  value: any;
  minFileSize?: string;
  maxFileSize?: string;
  disabled?: boolean;
  filePosterMaxHeight?: number;
  allowMultiple?: boolean;
}

function buildInitialFile(fileInfo: FileUploadModel): FilePondInitialFile {
  const fileUrl = CONFIG.UPLOAD_BASEPATH + fileInfo.directory + fileInfo.fileName;
  const isVideo = CONFIG.VIDEOS_EXTENSIONS.includes(fileInfo.extension);
  const posterUrl = isVideo
    ? CONFIG.UPLOAD_BASEPATH + fileInfo.directory + fileInfo.thumbnail
    : CONFIG.UPLOAD_BASEPATH + fileInfo.directory + fileInfo.fileName;

  return {
    source: fileInfo.id.toString(),
    options: {
      type: 'local',
      file: {
        name: fileInfo.fileName,
        type: isVideo ? 'video/*' : 'image/*',
        size: fileInfo.size
      },
      metadata: {
        poster: posterUrl,
        url: fileUrl
      }
    }
  };
}

function getError(errorCode: number): string {
  switch (errorCode) {
    case 401: return 'Is Not Authorized';
    case 404: return 'Not Found';
    case 500: return 'Operation Failed';
    case 501: return 'Invalid Validation';
    case 502: return 'File Type Is Not Allowed';
    case 503: return 'It"s Duplicate';
    case 504: return 'Exception Throwed';
    case 505: return 'File Is Too Large';
    case 506: return 'File Is Too Small';
    default: return 'Error During Upload';
  }
}

export default function ImageUpload({
  name,
  setFieldValue,
  value,
  minFileSize,
  maxFileSize,
  disabled,
  filePosterMaxHeight,
  allowMultiple
}: Readonly<ImageUploadProps>) {
  const [files, setFiles] = useState<Array<FilePondInitialFile | Blob | string>>([]);
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const fileService = useMemo(() => new FileStorageService(jwt ?? ''), [jwt]);

  const loadFiles = useCallback(async (fileIds: number[]) => {
    const result = await fileService.getFilesInfoById(fileIds);
    if (result.data) {
      setFiles(result.data.map(buildInitialFile));
    }
  }, [fileService]);

  const loadFile = useCallback(async (fileId: number) => {
    const result = await fileService.getFileInfoById(fileId);
    if (result.data) {
      setFiles([buildInitialFile(result.data)]);
    }
  }, [fileService]);

  useEffect(() => {
    if (allowMultiple) {
      if (value?.length > 0) {
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
  }, [value, allowMultiple, loadFiles, loadFile]);

  const handleUpdateFiles = useCallback((fileItems: FilePondFile[]) => {
    const fileInfosData: Array<FilePondInitialFile | Blob | string> = fileItems.map(fileInfo => {
      if (fileInfo.origin === FileOrigin.LOCAL) {
        return {
          source: fileInfo.source.toString(),
          options: {
            type: 'local',
            file: {
              name: fileInfo.filename,
              type: fileInfo.fileType,
              size: fileInfo.fileSize
            },
            metadata: {
              poster: fileInfo.getMetadata('poster'),
              url: fileInfo.getMetadata('url')
            }
          }
        };
      }
      return fileInfo.file;
    });
    setFiles(fileInfosData);
  }, []);

  const handleBeforeRemoveFile = useCallback(async (file: FilePondFile): Promise<boolean> => {
    if (!setFieldValue || !file) return false;

    const fileId = parseInt(file.serverId);
    if (isNaN(fileId)) return false;

    const result = await fileService.deleteFile(fileId);
    if (result.succeeded) {
      if (allowMultiple) {
        const currentIds = Array.isArray(value) ? [...value] : [];
        setFieldValue(name, currentIds.filter(id => id !== fileId));
      } else {
        setFieldValue(name, undefined);
      }
      return true;
    }
    return false;
  }, [fileService, setFieldValue, allowMultiple, value, name]);

  const handleProcessFile = useCallback((error: any, file: FilePondFile) => {
    if (!setFieldValue || error) return;

    const response = JSON.parse(file.serverId);
    if (!response?.succeeded) return;

    const fileInfo = response.data;
    if (allowMultiple) {
      const currentIds = Array.isArray(value) ? [...value] : [];
      currentIds.push(fileInfo.id);
      setFieldValue(name, currentIds);
    } else {
      setFieldValue(name, fileInfo.id);
    }
  }, [setFieldValue, allowMultiple, value, name]);

  return (
    <FilePond
      disabled={disabled}
      id={name || 'fileId'}
      allowImagePreview
      filePosterMaxHeight={filePosterMaxHeight}
      allowDownloadByUrl
      allowFilePoster
      allowFileTypeValidation
      acceptedFileTypes={['image/png', 'image/jpeg', 'video/*']}
      labelFileTypeNotAllowed={"نوع فایل مجاز نیست"}
      fileValidateTypeLabelExpectedTypes={"انتظار می‌رود {allButLastType} یا {lastType}"}
      allowFileSizeValidation
      minFileSize={minFileSize ?? '5KB'}
      maxFileSize={maxFileSize ?? '200MB'}
      labelMaxFileSizeExceeded={"فایل خیلی بزرگ است"}
      labelMaxFileSize={"حداکثر اندازه فایل {filesize} است"}
      labelMinFileSizeExceeded={"فایل خیلی کوچک است"}
      labelMinFileSize={"حداقل اندازه فایل {filesize} است"}
      labelIdle={"فایل‌های خود را بکشید و رها کنید یا <span class='filepond--label-action'>مرور کنید</span>"}
      allowReplace
      instantUpload
      allowMultiple={allowMultiple ?? false}
      credits={false}
      name="file"
      files={files}
      onupdatefiles={handleUpdateFiles}
      beforeRemoveFile={handleBeforeRemoveFile}
      server={{
        url: CONFIG.API_BASEPATH + '/FileStorage/UploadFile',
        headers: { Authorization: `Bearer ${jwt}`, UploadAction: 'Rename' }
      }}
      onprocessfile={handleProcessFile}
      labelFileProcessingError={(error: any) => getError(error.code)}
    />
  );
}
