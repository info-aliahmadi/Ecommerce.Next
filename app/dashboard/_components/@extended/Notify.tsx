'use client';
import styled from '@emotion/styled';
import { Alert, Snackbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function Notify({ notify, setNotify, sx }: Readonly<{ notify: NotifyProps, setNotify: setNotify, sx?: any }>) {
  const Strong = styled.strong`
    font-weight: 900;
    margin: auto 5px;
  `;
  const [open, setOpen] = useState<boolean>();
  const t = useTranslations("");
 
  let description: string = notify.type == 'error' ? t('notification.error-description') : t('notification.success-description');

  if (notify.type === 'error' && notify.description) {
    if (notify.description?.response?.data?.message) {
      description = notify.description?.response?.data?.message;
    } else {
      if (notify.description?.message) {
        description = notify.description?.message;
      } else {
        description = notify.description;
      }
    }
  } else if (notify.type != 'error' && notify.description) {
    description = notify.description;
  }

  useEffect(() => {
    setOpen(notify.open);
  }, [notify.open]);

  const handleClose = (event: Event | React.SyntheticEvent<any, Event>, reason?: string) => {
    setNotify({ ...notify, open: false });
  };

  const getTitle = () => {
    if (notify.title) {
      return t(notify.title);
    }
    return notify.type == 'error' ? t('notification.error') : t('notification.success');
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: notify.position?.vertical ? notify.position?.vertical : 'top',
        horizontal: notify.position?.horizontal ? notify.position?.horizontal : 'center'
      }}
      open={open}
      autoHideDuration={notify.autoHideDuration ? notify.autoHideDuration : undefined}
      onClose={handleClose}
      sx={sx}
    >
      <Alert
        onClose={handleClose}
        severity={notify.type ? notify.type : 'success'}
        variant="filled"
        sx={{ width: '100%' }}
        data-i18n="[html]content.body"
        title={getTitle()}
      >
        <Typography variant="h5">
          <Strong>{getTitle()}</Strong>
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </Alert>
    </Snackbar>
  );
}
export default React.memo(Notify);
