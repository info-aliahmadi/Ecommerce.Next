'use client'
import { useEffect, useState } from 'react';

// material-ui
import { InputLabel, MenuItem, Select, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import languageList from '@root/locales/languageList';
import LocalizationService from '@root/locales/LocalizationService';
import Notify from '@dashboard/_components/@extended/Notify';
import { useSession } from 'next-auth/react';
import CONFIG from '@root/config';
import nextIntlService from '@root/locales/nextIntlService';

// ============================|| FIREBASE - REGISTER ||============================ //

const ChangeLanguageForm = () => {


  const [currentLanguage, setCurrentLanguage] = useState<Language>();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      let locale = session?.user?.defaultLanguage ?? CONFIG.DEFAULT_LANGUAGE;
      let cl = languageList.find((l) => l.key === locale);
      setCurrentLanguage(cl);
    }
  }, [])

  const { data: session, update } = useSession();

  const accessToken = session?.accessToken;

  const [notify, setNotify] = useState({ open: false });

  const changeLanguage = async (lng: Language) => {
    let locService = new LocalizationService(accessToken ?? '');
    locService.setCurrentLanguage(lng);
    // Set both cookies for compatibility
    nextIntlService.setNextIntlLocale(lng.key);
    if (session) {
      session.user.defaultLanguage = lng.key;
      await update({ ...session, user: session.user });
    }
    // Refresh the page to apply the new locale
    window.location.reload();
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={Yup.object().shape({})}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setSubmitting(true);
            setStatus({ success: true });
          } catch (err: any) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container direction="row" sx={{ justifyContent: "center" }} >
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 6, xl: 6 }}>
                <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                  <Grid size={{ xs: 12 }}>
                    <Stack>
                      <InputLabel id="language-select-label">Default Language</InputLabel>
                      {currentLanguage && <Select
                        labelId="language-select-label"
                        id="demo-simple-select"
                        value={currentLanguage?.key}
                        label="Default Language"
                        onChange={handleChange}
                      >
                        {languageList.map((language) => (
                          <MenuItem key={'page' + language.key} value={language.key} onClick={() => changeLanguage(language)}>
                            <img src={language.icon} alt={language.name} style={{ width: '20px', margin: '0px 5px' }} /> {language.name}
                          </MenuItem>
                        ))}
                      </Select>}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangeLanguageForm;
