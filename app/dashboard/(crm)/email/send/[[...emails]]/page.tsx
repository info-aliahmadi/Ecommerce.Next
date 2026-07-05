'use client';

import React, { useEffect, useState } from 'react';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import { ArrowBack, Save, Send } from '@mui/icons-material';
import * as Yup from 'yup';
import { Formik, FormikErrors } from 'formik';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import MainCard from '@dashboard/_components/MainCard';
import setServerErrors from '@root/utils/setServerErrors';
import { useRouter } from 'next/navigation';
import EmailOutboxService from '@dashboard/(crm)/_service/EmailOutboxService';
import SelectEmailAddress from '@dashboard/(crm)/_components/Email/SelectEmailAddress';
import Editor from '@root/app/dashboard/_components/Editor/Editor';
import FileUpload from '@dashboard/_components/FileUpload/FileUpload';
import { useSession } from 'next-auth/react';
import EmailOutboxModel from '../../../_types/EmailOutboxModel';


export default function SendEmailOutbox({ params }: { readonly params: Promise<{ emails: string }> }) {
  const t = useTranslations("");

  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const { emails } = React.use(params);

  let toAdresses = emails ? decodeURIComponent(emails).split(',') : [];

  let service = new EmailOutboxService(jwt ?? '');
  const [fieldsName, validation, buttonName] = ['fields.email.emailOutbox.', 'validation.email.', 'buttons.email.emailOutbox.'];
  const [emailOutbox, setEmailOutbox] = useState<EmailOutboxModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const router = useRouter();


  const handleSubmit = async (emailOutbox: EmailOutboxModel, resetForm: any, setErrors: (errors: FormikErrors<EmailOutboxModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (!emailOutbox.isDraft) {
      service
        .sendEmailOutbox(emailOutbox)
        .then(() => {
          resetForm(undefined);
          setEmailOutbox(undefined);
          setNotify({ open: true });
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
        })
        .finally(() => {
          setSubmitting(false);
        });

    } else {
      service
        .saveDraftEmailOutbox(emailOutbox)
        .then((result) => {
          
          resetForm(undefined);
          setEmailOutbox(undefined);
          setNotify({ open: true });
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };
  const initialValues: EmailOutboxModel = {
    id: emailOutbox?.id ?? 0,
    subject: emailOutbox?.subject ?? '',
    content: emailOutbox?.content ?? '',
    registerDate: emailOutbox?.registerDate,
    isDraft: emailOutbox?.isDraft,
    toAddress: emailOutbox?.toAddress ?? [],
    attachments: emailOutbox?.attachments ?? [],
    fromAddress: []
  }
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          subject: Yup.string()
            .max(250)
            .required(t(validation + 'requiredSubject')),
          toAddress: Yup.array().min(1, t(validation + 'requiredtoAddress')).required(t(validation + 'requiredtoAddress'))
        })}
        onSubmit={(values, { setErrors, setStatus, setSubmitting, resetForm }) => {
          try {
            setSubmitting(true);
            handleSubmit(values, resetForm, setErrors, setSubmitting);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
          }
        }}
      >
        {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
              <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} spacing={3} >
                <Grid size={12}>
                  <Typography variant="h5">{t('pages.cards.sendEmail')}</Typography>
                </Grid>
                <Grid size={12}>
                  <MainCard>
                    <Grid container spacing={3} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 8 }}>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="toUserIds">{t(fieldsName + 'toAddress')}</InputLabel>
                            <SelectEmailAddress
                              id="toAddress"
                              name="toAddress"
                              label={t(fieldsName + 'toAddress')}
                              setFieldValue={setFieldValue}
                              defaultValues={values?.toAddress || toAdresses || ''}
                              error={Boolean(touched.toAddress && errors.toAddress)}
                            />
                            {touched.toAddress && errors.toAddress && (
                              <FormHelperText error id="helper-text-subject">
                                {errors.toAddress}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="subject">{t(fieldsName + 'subject')}</InputLabel>
                            <OutlinedInput
                              id="subject"
                              name="subject"
                              type="text"
                              value={values?.subject || ''}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder={t(fieldsName + 'subject')}
                              fullWidth
                              error={Boolean(touched.subject && errors.subject)}
                            />
                            {touched.subject && errors.subject && (
                              <FormHelperText error id="helper-text-subject">
                                {errors.subject}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                          <Stack spacing={1}>
                            <Editor
                              id="content"
                              name="content"
                              defaultValue={values?.content || ''}
                              setFieldValue={setFieldValue}
                            />
                            {touched.content && errors.content && (
                              <FormHelperText error id="content">
                                {errors.content}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} size={{ lg: 12, xl: 4 }} sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <Grid size={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="attachments">{t(fieldsName + 'attachments')}</InputLabel>
                            <FileUpload
                              id="attachments"
                              name="attachments"
                              setFieldValue={setFieldValue}
                              value={values?.attachments || ''}
                              allowMultiple={true}
                              filePosterMaxHeight={200}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Grid size={12}>
                          <Stack direction="row" spacing={2}>
                            <AnimateButton>
                              <Button
                                size="large"
                                onClick={() => {
                                  router.back();
                                }}
                                variant="outlined"
                                color="secondary"
                                startIcon={<ArrowBack />}
                              >
                                {t('buttons.back')}
                              </Button>
                            </AnimateButton>
                            <AnimateButton>
                              <Button
                                disabled={isSubmitting}
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={() => setFieldValue('isDraft', false)}
                                startIcon={<Send />}
                              >
                                {t(buttonName + 'send')}
                              </Button>
                            </AnimateButton>
                            <AnimateButton>
                              <Button
                                size="large"
                                type="submit"
                                disabled={isSubmitting}
                                variant="contained"
                                color="warning"
                                onClick={() => setFieldValue('isDraft', true)}
                                startIcon={<Save />}
                              >
                                {t(buttonName + 'draft')}
                              </Button>
                            </AnimateButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
