import { useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import ArticlesService from '@dashboard/(cms)/_service/ArticlesService';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import ArticleModel from '../../_types/Article/ArticleMode';

const DeleteArticle = ({ row, open, setOpen, refetch }: { row?: MRT_Row<ArticleModel>; open: boolean; setOpen: (open: boolean) => void; refetch: () => void }) => {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let articleService = new ArticlesService(jwt ?? '');
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    let articleId = row?.original.id;

    articleId && articleService
      .deleteArticle(articleId)
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
            {t('buttons.article.delete')}
          </Typography>
          <CloseDialog onClose={onClose} />
        </DialogTitle>
        <DialogContent>
        <div id="alert-dialog-description">
            <Typography variant="caption" sx={{ fontSize: 15 }}>
              {t('dialog.delete.moveToTrash')}
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

export default DeleteArticle;
