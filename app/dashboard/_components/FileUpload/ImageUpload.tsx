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

import CONFIG from '@root/config';
import { useSession } from 'next-auth/react';
import { FileOrigin, FilePondFile, FilePondInitialFile } from 'filepond';
import FileStorageService from '@dashboard/(filestorage)/_service/FileStorageService';
import FileUploadModel from '@dashboard/(filestorage)/_types/FileUploadModel';
import FileImageModel from '@root/app/types/FileImageModel';

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
  value: FileImageModel | FileImageModel[] | number | number[] | null;
  minFileSize?: string;
  maxFileSize?: string;
  disabled?: boolean;
  filePosterMaxHeight?: number;
  allowMultiple?: boolean;
  allowReorder?: boolean;
  valueType?: 'FileImageModel' | 'number';
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
  disabled = false,
  filePosterMaxHeight = 300,
  allowMultiple = false,
  allowReorder = false,
  valueType = 'number'
}: Readonly<ImageUploadProps>) {
  const [files, setFiles] = useState<Array<FilePondInitialFile | Blob | string>>([]);
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const fileService = useMemo(() => new FileStorageService(jwt ?? ''), [jwt]);

  const loadMultipleFilesByIds = useCallback(async (fileIds: number[]) => {
    const result = await fileService.getFilesInfoById(fileIds);
    if (result.data) {
      setFiles(result.data.map(buildInitialFile));
    }
  }, [fileService]);

  const loadMultipleFilesByModels = useCallback(async (imageModels: FileImageModel[]) => {
    const fileIds = imageModels.map(img => img.imageId);
    const result = await fileService.getFilesInfoById(fileIds);
    if (result.data) {
      const sortedFiles = imageModels
        .map(img => {
          const fileInfo = result.data?.find(f => f.id === img.imageId);
          return fileInfo ? { initialFile: buildInitialFile(fileInfo), displayOrder: img.displayOrder } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a!.displayOrder - b!.displayOrder)
        .map(item => item!.initialFile);
      setFiles(sortedFiles);
    }
  }, [fileService]);

  const loadSingleFile = useCallback(async (fileId: number) => {
    const result = await fileService.getFileInfoById(fileId);
    if (result.data) {
      setFiles([buildInitialFile(result.data)]);
    }
  }, [fileService]);

  useEffect(() => {
    if (allowMultiple) {
      if (valueType == 'FileImageModel') {
        loadMultipleFilesByModels(value as FileImageModel[]);
      } else if (valueType == 'number') {
        loadMultipleFilesByIds(value as number[]);
      } else {
        setFiles([]);
      }
    } else {
      const fileId = valueType === 'FileImageModel' ? (value as FileImageModel).imageId : value as number;
      if (fileId && fileId > 0) {
        loadSingleFile(fileId);
      } else {
        setFiles([]);
      }
    }
  }, [value, allowMultiple, valueType, loadMultipleFilesByModels, loadMultipleFilesByIds, loadSingleFile]);

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

    fileService.deleteFile(fileId);

    if (allowMultiple) {
      if (valueType == 'FileImageModel') {
        setFieldValue(name, (value as FileImageModel[]).filter(img => img.imageId !== fileId));
      } else if (valueType == 'number') {
        setFieldValue(name, (value as number[]).filter(id => id !== fileId));
      } else {
        setFieldValue(name, []);
      }
    } else {
      setFieldValue(name, null);
    }
    return true;
  }, [fileService, setFieldValue, allowMultiple, value, name]);

  const handleProcessFile = useCallback((error: any, file: FilePondFile) => {
    if (!setFieldValue || error) return;

    const response = JSON.parse(file.serverId);
    if (!response?.succeeded) return;

    const fileInfo = response.data;
    if (allowMultiple) {
      if (valueType == 'FileImageModel') {
        const newImage: FileImageModel = {
          imageId: fileInfo.id,
          displayOrder: (value as FileImageModel[]).length
        };
        setFieldValue(name, [...(value as FileImageModel[]), newImage]);
      } else if (valueType == 'number') {
        setFieldValue(name, [...(value as number[]), fileInfo.id]);
      } else {
        setFieldValue(name, [fileInfo.id]);
      }
    } else {
      setFieldValue(name, fileInfo.id);
    }
  }, [setFieldValue, allowMultiple, value, name]);

  const handleReorder = useCallback((newOrderedFiles: FilePondFile[]) => {
    if (!setFieldValue || !allowMultiple) return;

    const reorderedIds = newOrderedFiles.map(f => parseInt(f.serverId)).filter(id => !isNaN(id));
    if (valueType == 'FileImageModel') {
      const updatedImages = reorderedIds.map((id, index) => ({
        imageId: id,
        displayOrder: index
      }));
      setFieldValue(name, updatedImages);
    } else if (valueType == 'number') {
      setFieldValue(name, reorderedIds);
    }
  }, [setFieldValue, allowMultiple, value, name]);

  return (
    <FilePond
      disabled={disabled}
      id={name || 'fileId'}
      allowImagePreview
      allowReorder={allowReorder}
      onreorderfiles={handleReorder}
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
