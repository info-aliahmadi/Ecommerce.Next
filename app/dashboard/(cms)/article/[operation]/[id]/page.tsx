'use client'
import React, { useEffect, useState } from 'react';

// material-ui
import { Avatar, Button, Chip, FormHelperText, Grid, InputLabel, Link, OutlinedInput, Stack, Typography } from '@mui/material';
import { ArrowBack, Save, Send, EventNote } from '@mui/icons-material';
// third party
import * as Yup from 'yup';
import { Formik, FormikErrors } from 'formik';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import CONFIG from '@root/config';
import MainCard from '@dashboard/_components/MainCard';
import setServerErrors from '@root/utils/setServerErrors';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import ArticlesService from '@dashboard/(cms)/_service/ArticlesService';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';
import SelectTopic from '@dashboard/(cms)/_components/Topic/SelectTopic';
import SelectTag from '@dashboard/(cms)/_components/Tag/SelectTag';
import DateTimeInput from '@dashboard/_components/DateTime/DateTimeInput';
import Editor from '@root/app/dashboard/_components/Editor/Editor';
import { useSession } from 'next-auth/react';
import ArticleModel from '../../../_types/Article/ArticleMode';
import nextIntlService from '@root/locales/nextIntlService';



export default function AddOrEditArticle({ params }: { readonly params: Promise<{ id: number, operation: 'edit' | 'add' }> }) {
  const t = useTranslations("");
  const { id, operation } = React.use(params);

  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let language = nextIntlService.getNextIntlLocale();

  let articleService = new ArticlesService(jwt ?? '');
  const [fieldsName, validation, buttonName] = ['fields.article.', 'validation.article.', 'buttons.article.'];
  const [article, setArticle] = useState<ArticleModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const router = useRouter();

  const loadArticle = () => {
    articleService.getArticleById(id).then((result) => {
      setArticle(result.data);
    });
  };
  useEffect(() => {
    document.title = t('pages.cards.article-' + operation) + " - " + CONFIG.APP_HEADER;
  }, [operation, t]);

  const handleSubmit = async (article: ArticleModel, resetForm: any, setErrors: (errors: FormikErrors<ArticleModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (operation == 'add') {
      articleService
        .addArticle(article)
        .then(() => {
          resetForm();
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
      articleService
        .updateArticle(article)
        .then((result) => {
          setArticle(result.data);
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
  const initialValues: ArticleModel = {
    id: article?.id ?? 0,
    subject: article?.subject ?? '',
    body: article?.body ?? '',
    registerDate: article?.registerDate,
    publishDate: article?.publishDate ?? new Date(),
    writer: article?.writer,
    editor: article?.editor,
    editDate: article?.editDate,
    isDraft: article?.isDraft ?? false,
    previewImageId: article?.previewImageId,
    previewImageUrl: article?.previewImageUrl,
    topicsIds: article?.topicsIds ?? [],
    tags: article?.tags ?? [],
    isDeleted: false,
    isPinned: false
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
          body: Yup.string().required(t(validation + 'requiredBody')),
          publishDate: Yup.string().required(t(validation + 'requiredPublishDate')),
          topicsIds: Yup.array()
            .min(1, t(validation + 'requiredTopics'))
            .required(t(validation + 'requiredTopics'))
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
                  <Typography variant="h5">{t('pages.cards.article-' + operation)}</Typography>
                </Grid>
                <Grid size={12}>
                  <MainCard>
                    <Grid container spacing={3} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }} >
                      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 8 }}>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="subject">{t(fieldsName + 'subject')}</InputLabel>
                            <OutlinedInput
                              id="subject"
                              type="subject"
                              value={values?.subject || ''}
                              name="subject"
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
                            <InputLabel htmlFor="body">{t(fieldsName + 'body')}</InputLabel>
                            <Editor
                              id={'body'}
                              name={'body'}
                              defaultValue={values?.body || ''}
                              setFieldValue={setFieldValue}
                            />
                            {operation == 'edit' && (
                              <Grid size={12}>
                                <span>{t(fieldsName + 'writedBy') + ' : '}</span>
                                <Chip
                                  title={t(fieldsName + 'writer')}
                                  avatar={<Avatar src={CONFIG.AVATAR_BASEPATH + values.writer?.avatar} />}
                                  label={values.writer?.userName}
                                  variant="filled"
                                  size="small"
                                  sx={{ borderRadius: '16px' }}
                                />{' '}
                                <Chip
                                  icon={<EventNote />}
                                  title={t(fieldsName + 'registerDate')}
                                  label={values.registerDate
                                    ? new Intl.DateTimeFormat(language, {
                                      dateStyle: 'long',
                                      timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                                      hour12: false
                                    }).format(moment(values.registerDate).toDate()) : ''}
                                  variant="filled"
                                  size="small"
                                  sx={{ borderRadius: '16px' }}
                                />{' '}
                                {values.editor?.userName && (
                                  <span>
                                    <span>{t(fieldsName + 'editedBy') + ' : '}</span>
                                    <Chip
                                      title={t(fieldsName + 'editor')}
                                      avatar={<Avatar src={CONFIG.AVATAR_BASEPATH + values.editor?.avatar} />}
                                      label={values.editor?.userName}
                                      variant="filled"
                                      size="small"
                                      sx={{ borderRadius: '16px' }}
                                    />{' '}
                                    <Chip
                                      icon={<EventNote />}
                                      title={t(fieldsName + 'editDate')}
                                      label={values.editDate
                                        ? new Intl.DateTimeFormat(language, {
                                          dateStyle: 'long',
                                          timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                                          hour12: false
                                        }).format(moment(values.editDate).toDate()) : ''}
                                      variant="filled"
                                      size="small"
                                      sx={{ borderRadius: '16px' }}
                                    />{' '}
                                  </span>
                                )}
                              </Grid>
                            )}
                            {touched.body && errors.body && (
                              <FormHelperText error id="helper-text-body">
                                {errors.body}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container size={{ lg: 12, xl: 4 }} sx={{ justifyContent: "flex-start", alignItems: "flex-start" }} >
                        <Grid size={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="previewImageId">{t(fieldsName + 'previewImageId')}</InputLabel>
                            <ImageUpload
                              name="previewImageId"
                              setFieldValue={setFieldValue}
                              value={values?.previewImageId ?? ''}
                              filePosterMaxHeight={400}
                            />
                            {(values?.previewImageId == null || values?.previewImageId == undefined) && (
                              <OutlinedInput
                                id="previewImageUrl"
                                type="text"
                                value={values?.previewImageUrl || ''}
                                name="previewImageUrl"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder={t(fieldsName + 'previewImageUrl')}
                                fullWidth
                                error={Boolean(touched.previewImageUrl && errors.previewImageUrl)}
                              />
                            )}
                          </Stack>
                        </Grid>
                        <Grid container size={{ sm: 12, md: 6, lg: 6, xl: 12 }} sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}   >
                          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="topicsIds">{t(fieldsName + 'topicsIds')}</InputLabel>
                              <SelectTopic
                                defaultValues={values?.topicsIds || []}
                                id="topicsIds"
                                setFieldValue={setFieldValue}
                                error={Boolean(touched.topicsIds && errors.topicsIds)}
                              />
                              {touched.topicsIds && errors.topicsIds && (
                                <FormHelperText error id="helper-roleIds">
                                  {errors.topicsIds}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="tags">
                                {t(fieldsName + 'tags')}
                                <Link href="/tagsList" target="_blank">
                                  {' '}
                                  (Manage Tags)
                                </Link>
                              </InputLabel>
                              <SelectTag
                                defaultValues={values?.tags || []}
                                id="tags"
                                setFieldValue={setFieldValue}
                                error={Boolean(touched.tags && errors.tags)}
                              />
                              {touched.tags && errors.tags && (
                                <FormHelperText error id="helper-tagIds">
                                  {errors.tags}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="publishDate">{t(fieldsName + 'publishDate')}</InputLabel>
                            <DateTimeInput
                              name="publishDate"
                              label={t(fieldsName + 'publishDate')}
                              setFieldValue={setFieldValue}
                              defaultValue={values?.publishDate}
                              error={Boolean(touched.publishDate && errors.publishDate)}
                            />
                            {touched.publishDate && errors.publishDate && (
                              <FormHelperText error id="helper-text-publishDate">
                                {errors.publishDate}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Grid size={12}>
                          <Stack direction="row" spacing={2}>
                            {' '}
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
                                {t('buttons.cancel')}
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
                                {operation == 'edit' ? t(buttonName + 'save') : t(buttonName + 'publish')}
                              </Button>
                            </AnimateButton>
                            <AnimateButton>
                              <Button
                                disabled={isSubmitting}
                                size="large"
                                type="submit"
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
