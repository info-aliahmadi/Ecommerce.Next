// material-ui
import {
  Box,
  Breadcrumbs,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  Grow,
  IconButton,
  Link,
  Slide,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';

// project import
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { InfoOutlined, Download, Delete, UploadFile, InsertDriveFile } from '@mui/icons-material';

import LinkIcon from '@mui/icons-material/Link';

import { fileSizeViewer } from '@root/utils/fileSizeViewer';
import CONFIG from '@root/config';
import DeleteFile from './DeleteFile';
import Notify from '@dashboard/_components/@extended/Notify';
import MainCard from '@dashboard/_components/MainCard';
import FileUpload from '@dashboard/_components/FileUpload/FileUpload';
import FileStorageService from '@dashboard/(filestorage)/_service/FileStorageService';
import { useSession } from 'next-auth/react';
import FileUploadModel from '../_types/FileUploadModel';
import { Capitalize, Truncate } from '@root/utils/StringViewer';

// ===============================|| COLOR BOX ||=============================== //

function FilesList({ directory }: Readonly<{ directory: string }>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const currentLanguage = session?.user.defaultLanguage;

  const theme = useTheme();

  const [files, setFiles] = useState<FileUploadModel[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [fileId, setFileId] = useState(0);
  const containerRef = useRef(null);

  let mediaExtensions = CONFIG.IMAGES_EXTENSIONS.concat(CONFIG.VIDEOS_EXTENSIONS);

  const [uploadShow, setUploadShow] = useState(false);

  const [copy, setCopy] = useState(false);

  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  let fileStorageService = new FileStorageService(jwt ?? '');

  const loadFiles = () => {
    fileStorageService
      .getFilesListByDirectory(directory)
      .then((result) => {
        setFiles(result.data ?? []);
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };

  useEffect(() => {
    loadFiles();
  }, [directory]);
  const handleDeleteFile = (fileId: number) => {
    setFileId(fileId);
    setOpenDelete(true);
  };
  const Breadcramb = () => {
    return (
      <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Grid size={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/dashboard/filestorage">
              {t('pages.cards.fileStorage')}
            </Link>
            <Link underline="hover" color="inherit" href="#">
              {Capitalize(directory)}
            </Link>
          </Breadcrumbs>
        </Grid>
        <Grid size={12}>
          <Chip
            onClick={() => setUploadShow(!uploadShow)}
            // href="/ArticlesTrashList"
            clickable
            component="a"
            target="_blank"
            icon={<UploadFile />}
            title={t('buttons.fileStorage.uploadFiles')}
            label={t('buttons.fileStorage.uploadFiles')}
            variant="outlined"
            size="medium"
            color="primary"
            sx={{ borderRadius: '16px' }}
          />
        </Grid>
      </Grid>
    );
  };

  const FileViewer = ({ extention }: { extention: string }) => {
    extention = extention.toLowerCase();
    let themeMode = theme.palette.mode;
    let bgColor = themeMode == 'light' ? 'secondary.main' : 'secondary.light';
    switch (extention) {
      case 'pdf':
        bgColor = themeMode == 'light' ? 'error.dark' : 'error.light';
        break;
      case 'doc':
      case 'docx':
        bgColor = themeMode == 'light' ? 'primary.dark' : 'primary.light';
        break;
      case 'xls':
      case 'xlsx':
      case 'csv':
        bgColor = themeMode == 'light' ? 'success.dark' : 'success.light';
        break;
      case 'zip':
      case 'rar':
        bgColor = themeMode == 'light' ? 'warning.main' : 'warning.light';
        break;
    }

    return (
      <Box
        sx={{
          //width: 300,
          height: 194,
          p: 2,
          textAlign: 'center',
          backgroundColor: bgColor,
          '&:hover': {
            opacity: [0.9, 0.8, 0.7]
          }
        }}
      >
        <InsertDriveFile sx={{ fontSize: '100px' }} />
        <Typography variant="h2" sx={{ display: "block" }} gutterBottom>
          {extention.toUpperCase()}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MainCard title={<Breadcramb />} ref={containerRef}>
        <Slide direction="down" in={uploadShow} mountOnEnter unmountOnExit container={containerRef.current}>
          <Box sx={{ p: 3 }}>
            <FileUpload allowMultiple name='FileUpload1' />
          </Box>
        </Slide>
        <Grid container spacing={3} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
          {files.map((file) => (
            <Grow in={true} key={'card-' + file.fileName}>
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 2, xl: 2 }}>
                <Card>
                  {mediaExtensions.some((extension) => extension == file?.extension.toLowerCase()) ? (
                    <CardMedia
                      component={'img'}
                      height="194"
                      image={CONFIG.UPLOAD_BASEPATH + file.directory + file.thumbnail}
                      alt={file.alt}
                    />
                  ) : (
                    <CardMedia component="div" sx={{ height: 194 }} children={<FileViewer extention={file.extension} />} />
                  )}
                  <CardHeader sx={{ padding: '10px' }} title={Truncate(file.fileName)} subheader={fileSizeViewer(file.size, true)} />

                  <CardActions disableSpacing>
                    <Grid container sx={{ justifyContent: 'space-between' }}>
                      <Grid size={12}>
                        <Tooltip
                          arrow
                          placement="top-start"
                          title={copy ? t('buttons.copyLinkDone') : t('buttons.copyLink')}
                          onClick={() => {
                            navigator.clipboard.writeText(CONFIG.UPLOAD_BASEPATH + file.directory + file.fileName);
                            setCopy(true);
                            window.setTimeout(function () {
                              setCopy(false);
                            }, 2000);
                          }}
                        >
                          <IconButton>
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top-start" title={t('buttons.download')}>
                          <IconButton href={CONFIG.UPLOAD_BASEPATH + file.directory + file.fileName} target="_blank">
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          arrow
                          placement="top-start"
                          title={t('buttons.fileStorage.uploadedInfo', {
                            user: file.userName,
                            date: file.uploadDate.toLocalDatetime(currentLanguage ?? "")
                          })}
                        >
                          <IconButton>
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid size={12}>
                        <Tooltip arrow placement="top-start" title={t('buttons.delete')}>
                          <IconButton color="error" onClick={() => handleDeleteFile(file.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>
      </MainCard>
      <DeleteFile open={openDelete} setOpen={setOpenDelete} fileId={fileId} files={files} setFiles={setFiles} />
    </>
  );
}

export default FilesList;
