'use client';

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import { ArrowBack, Save, Send } from '@mui/icons-material';
import * as Yup from 'yup';
import { Formik, FormikErrors } from 'formik';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import MainCard from '@dashboard/_components/MainCard';
import setServerErrors from '@root/utils/setServerErrors';
import { useRouter } from 'next/navigation';
import MessagesService from '@dashboard/(crm)/_service/MessageService';
import Editor from '@dashboard/_components/Editor/Editor';
import FileUpload from '@dashboard/_components/FileUpload/FileUpload';
import { useSession } from 'next-auth/react';
import SelectMultiUsers from '@root/app/dashboard/(auth)/_components/User/SelectMultiUsers';
import MessageModel, { MessageType } from '@dashboard/(crm)/_types/MessageModel';


export default function SendMessage({ params }: { readonly params: Promise<{ id: number, toUserId: number }> }) {
  const t = useTranslations("");
  const { id, toUserId } = React.use(params);

  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let messageService = new MessagesService(jwt ?? '');
  const [fieldsName, validation, buttonName] = ['fields.message.messageInbox.', 'validation.message.', 'buttons.message.messageInbox.'];
  const [message, setMessage] = useState<MessageModel>();
  const [isPublicMessage, setIsPublicMessage] = useState(false);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const router = useRouter();

  const loadMessage = () => {
    messageService.getMessageByIdForSender(id).then((result) => {
      setMessage(result.data);
    });
  };
  useEffect(() => {
    if (id > 0) loadMessage();
  }, [id, toUserId]);

  const handleSubmit = async (message: MessageModel, resetForm: any, setErrors: (errors: FormikErrors<MessageModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (!message.isDraft) {
      if (isPublicMessage) {
        message.toUserIds = [];
        messageService
          .sendPublicMessage(message)
          .then(() => {
            if (!(id > 0)) {
              resetForm();
              setSubmitting(true);
            }
            setNotify({ open: true });
          })
          .catch((error) => {
            setErrors(setServerErrors(error));
            setNotify({ open: true, type: 'error', description: error });
          });
      } else {
        messageService
          .sendPrivateMessage(message)
          .then(() => {
            if (!(id > 0)) {
              resetForm();
              setSubmitting(true);
            }
            setNotify({ open: true });
          })
          .catch((error) => {
            setErrors(setServerErrors(error));
            setNotify({ open: true, type: 'error', description: error });
          });
      }
    } else {
      messageService
        .saveDraftMessage(message)
        .then((result) => {
          resetForm();
          setNotify({ open: true });
        })
        .catch((error) => {
          setErrors(setServerErrors(error));
          setNotify({ open: true, type: 'error', description: error });
        });
    }
  };
  const initialValues: MessageModel = {
    id: message?.id ?? 0,
    subject: message?.subject ?? '',
    content: message?.content ?? '',
    registerDate: message?.registerDate,
    messageType: message?.messageType ?? MessageType.Private,
    isDraft: message?.isDraft ?? false,
    toUserIds: message?.toUserIds ?? [],
    attachments: message?.attachments ?? [],
    isDeleted: false,
    toUsers: message?.toUsers ?? [],
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
          toUserIds: !isPublicMessage
            ? Yup.array()
              .min(1, t(validation + 'requiredUserIds'))
              .required(t(validation + 'requiredUserIds'))
            : Yup.array().optional()
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
                  <Typography variant="h5">{t('pages.cards.sendMessage')}</Typography>
                </Grid>
                <Grid size={12}>
                  <MainCard>
                    <Grid container spacing={3} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 8 }}>
                        <Grid size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 10 }} >
                          <Stack spacing={1}>
                            <InputLabel htmlFor="toUserIds">{t(fieldsName + 'toUserIds')}</InputLabel>
                            <SelectMultiUsers
                              id="toUserIds"
                              label={t(fieldsName + 'toUserIds')}
                              disabled={isPublicMessage}
                              setFieldValue={setFieldValue}
                              defaultValues={id > 0 ? values?.toUserIds || [] : toUserId > 0 ? [toUserId] : []}
                              error={Boolean(touched.toUserIds && errors.toUserIds)}
                            />
                            {touched.toUserIds && errors.toUserIds && (
                              <FormHelperText error id="helper-text-subject">
                                {errors.toUserIds}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }} sx={{ p: 0, mt: 3 }} >
                          <Stack spacing={1}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  id="publicMessageType"
                                  checked={isPublicMessage}
                                  title={'Send To All Users'}
                                  color="default"
                                  size="large"
                                  onChange={() => setIsPublicMessage(!isPublicMessage)}
                                />
                              }
                              label={t(fieldsName + 'publicMessageType')}
                            />
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
                            <InputLabel htmlFor="content">{t(fieldsName + 'content')}</InputLabel>
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
                      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 4 }} sx={{ justifyContent: "flex-start", alignItems: "flex-start" }} >
                        <Grid size={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="attachments">{t(fieldsName + 'attachments')}</InputLabel>
                            <FileUpload
                              id="attachments"
                              name="attachments"
                              setFieldValue={setFieldValue}
                              value={values?.attachments || ''}
                              allowMultiple={true}
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
