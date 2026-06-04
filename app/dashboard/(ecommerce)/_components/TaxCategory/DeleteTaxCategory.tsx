import { useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// project import
import Notify from '@dashboard/_components/@extended/Notify';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import TaxCategoryService from '../../_service/TaxCategoryService';
import TaxCategoryModel from '../../_types/Common/TaxCategoryModel';

const DeleteTaxCategory = ({
  row,
  open,
  setOpen,
  refetch
}: {
  row?: MRT_Row<TaxCategoryModel>;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) => {
  const t = useTranslations('');
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const taxCategoryService = new TaxCategoryService(jwt ?? '');

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const taxCategoryId = row?.original.id;
    taxCategoryId &&
      taxCategoryService
        .deleteTaxCategory(taxCategoryId)
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
          <Typography variant="caption" sx={{ fontSize: 17, fontWeight: 600 }}>
            {t('buttons.taxCategory.delete')}
          </Typography>
          <CloseDialog onClose={onClose} />
        </DialogTitle>
        <DialogContent>
          <div id="alert-dialog-description">
            <Typography variant="caption" sx={{ fontSize: 15 }}>
              {t('dialog.delete.description')}
            </Typography>
          </div>
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

export default DeleteTaxCategory;
