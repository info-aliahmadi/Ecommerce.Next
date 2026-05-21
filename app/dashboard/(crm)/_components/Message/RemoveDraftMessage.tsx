import { useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import MessageService from '@dashboard/(crm)/_service/MessageService';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';

import MessageModel from '../../_types/MessageModel';

export default function RemoveDraftMessage({ row, open, setOpen, refetch }: Readonly<{ row?: MRT_Row<MessageModel>; open: boolean; setOpen: (open: boolean) => void; refetch: () => void }>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let messageService = new MessageService(jwt ?? '');
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const [disableBtn, setDisableBtn] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setDisableBtn(true);
    let messageId = row?.original.id;
    messageId && messageService
      .removeDraftMessage(messageId)
      .then(() => {
        onClose();
        setNotify({ open: true });
        refetch();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      })
      .finally(() => {
        setDisableBtn(false);
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
            {t('buttons.message.messageOutbox.remove')}
          </Typography>
          <CloseDialog onClose={onClose} />
        </DialogTitle>
        <DialogContent>
        <div id="alert-dialog-description">
            <Typography variant="caption" fontSize={15}>
              {t('dialog.delete.description')}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>{t('buttons.cancel')}</Button>
          <Button disableElevation disabled={disableBtn} onClick={handleSubmit} size="large" variant="contained" color="error">
            {t('buttons.remove')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

