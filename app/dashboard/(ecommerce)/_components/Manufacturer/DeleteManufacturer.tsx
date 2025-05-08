import { useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import { useSession } from 'next-auth/react';
import ManufacturerService from '../../_service/ManufacturerService';
import { MRT_Row } from 'material-react-table';

import ManufacturerModel from '../../_types/Product/ManufacturerModel';

const DeleteManufacturer = ({ row, open, setOpen, refetch }: { row?: MRT_Row<ManufacturerModel>; open: boolean; setOpen: (open: boolean) => void; refetch: () => void }) => {
  const [t] = useTranslation();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let manufacturerService = new ManufacturerService(jwt ?? '');

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    let manufacturerId = row?.original.id;
    manufacturerId && manufacturerService
      .deleteManufacturer(manufacturerId)
      .then(() => {
        onClose();
        setNotify({ open: true });
        refetch();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
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
            {t('buttons.manufacturer.delete')}
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
          <Button onClick={onClose}>Cancel</Button>
          <Button disableElevation onClick={handleSubmit} size="large" variant="contained" color="error">
            {t('buttons.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteManufacturer;
