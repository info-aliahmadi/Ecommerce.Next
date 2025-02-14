
import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid, InputLabel, Stack } from '@mui/material';

// third party
import { Formik } from 'formik';

// project import
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import Save from '@mui/icons-material/Save';

// assets
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import { useSession } from 'next-auth/react';
import MessageSettingService from '../_service/MessageSettingService';
import SelectMultiUsers from '../../(auth)/_components/User/SelectMultiUsers';
import { error } from 'console';
// ============================|| FIREBASE - REGISTER ||============================ //

const MessageSetting = () => {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  let settingsService = new MessageSettingService(jwt ?? '');
  const [fieldsName, validation, buttonName] = ['fields.message.messageSettings.', 'validation.message.messageSettings', 'buttons.'];
  const [settings, setSettings] = useState<MessageSettingModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const loadSettings = () => {
    settingsService.getSettings().then((result) => {
      setSettings(result.data);
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleAddOrUpdateSettings = (setting :MessageSettingModel , setSubmitting : any) => {
    settingsService
      .addOrUpdateSettings(setting)
      .then(() => {
        setNotify({ open: true });
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error.message });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  const initialValues: MessageSettingModel = {
    recipientIdsForContactMessage: settings?.recipientIdsForContactMessage ?? [],
    recipientIdsForRequestMessage: settings?.recipientIdsForRequestMessage ?? []
  }
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setSubmitting(true);
            handleAddOrUpdateSettings(values, setSubmitting);
            setStatus({ success: true });
          } catch (err) {
            setStatus({ success: false });
            
          }
        }}
      >
        {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container item spacing={3} justifyContent="flex-start">
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="recipientIdsForContactMessage">{t(fieldsName + 'recipientIdsForContactMessage')}</InputLabel>
                  <SelectMultiUsers
                    id="recipientIdsForContactMessage"
                    label={t(fieldsName + 'recipientIdsForContactMessage')}
                    setFieldValue={setFieldValue}
                    defaultValues={values?.recipientIdsForContactMessage || []}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="recipientIdsForRequestMessage">{t(fieldsName + 'recipientIdsForRequestMessage')}</InputLabel>
                  <SelectMultiUsers
                    id="recipientIdsForRequestMessage"
                    label={t(fieldsName + 'recipientIdsForContactMessage')}
                    setFieldValue={setFieldValue}
                    defaultValues={values?.recipientIdsForRequestMessage || []}
                  />
                </Stack>
              </Grid>

              <Grid container item spacing={3} direction="row" justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" spacing={2}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                      >
                        {t(buttonName + 'save')}
                      </Button>
                    </AnimateButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default MessageSetting;
