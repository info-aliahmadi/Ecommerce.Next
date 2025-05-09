import { Dispatch, SetStateAction, useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import FileStorageService from '@dashboard/(filestorage)/_service/FileStorageService';
import { useSession } from 'next-auth/react';
import FileUploadModel from '@dashboard/(filestorage)/_types/FileUploadModel';

interface DeleteFileProps {
  fileId?: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  files?: FileUploadModel[];
  setFiles: Dispatch<SetStateAction<FileUploadModel[]>>;
}

const DeleteFile = ({ fileId, open, setOpen, files, setFiles }: DeleteFileProps) => {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let fileStorageService = new FileStorageService(jwt ?? '');
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    fileId && fileStorageService
      .deleteFile(fileId)
      .then(() => {
        onClose();
        setNotify({ open: true });
        if (files) {
          let index = files.findIndex((x) => x.id == fileId);
          files.splice(index, 1);
          setFiles([...files]);
        }
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error.message });
      });
  };
  const CloseDialog = ({ onClose }: { onClose: () => void }) => (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500]
      }}
    >
      <CloseIcon />
    </IconButton>
  );

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <Typography variant="caption" fontSize={17} fontWeight={600}>
            {t('buttons.fileStorage.delete')}
          </Typography>
          <CloseDialog onClose={onClose} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="caption" fontSize={15}>
              {t('dialog.delete.description')}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>{t('buttons.cancel')}</Button>
          <Button disableElevation onClick={handleSubmit} size="large" variant="contained" color="error">
            {t('buttons.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteFile;
