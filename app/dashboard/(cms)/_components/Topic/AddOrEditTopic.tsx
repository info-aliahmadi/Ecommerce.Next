'use client'
import { useEffect, useState } from 'react';

// material-ui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// third party
import * as Yup from 'yup';
import { Formik, FormikErrors } from 'formik';
import AddIcon from '@mui/icons-material/Add';
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import TopicsService from '@dashboard/(cms)/_service/TopicService';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import TopicModel from '../../_types/Topic/TopicModel';

const AddOrEditTopic = ({ row, isNew, open, setOpen, refetch }:
  {
    row?: MRT_Row<TopicModel>,
    isNew: boolean,
    open: boolean,
    setOpen: (open: boolean) => void,
    refetch: () => void
  }) => {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let topicService = new TopicsService(jwt ?? '');
  const [fieldsName, validation, buttonName] = ['fields.topic.', 'validation.topic.', 'buttons.topic.'];
  const [topic, setTopic] = useState<TopicModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const loadTopic = () => {
    let tagId = row?.original?.id;
    tagId && topicService.getTopicById(tagId).then((result) => {
      setTopic(result.data);
    });
  };
  const onClose = () => {
    setOpen(false);
    setTopic(undefined);
  };
  useEffect(() => {
    if (isNew == false && row) {
      loadTopic();
    } else {
      setTopic(undefined);
    }
  }, [row, isNew, open]);

  const handleSubmit = (topic: TopicModel, setErrors: (errors: FormikErrors<TopicModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (isNew == true) {
      topicService
        .addTopic(topic)
        .then(() => {
          setTopic(undefined);
          onClose();
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      topicService
        .updateTopic(topic)
        .then(() => {
          setTopic(undefined);
          onClose();
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
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
  const initialValues: TopicModel = {
    id: topic?.id ?? 0,
    title: topic?.title ?? '',
    parentId: row && row?.original?.id > 0 && isNew ? row?.original?.id : topic?.parentId
  }
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t(validation + 'requiredTopicTitle'))
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setSubmitting(true);
              handleSubmit(values, setErrors, setSubmitting);
            } catch (err) {
              setStatus({ success: false });

            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {isNew == true
                  ? row
                    ? t('dialog.topic.addSub', { parentTitle: '"' + row?.original?.title + '"' })
                    : t('dialog.topic.addMain', { item: 'Topic' })
                  : t('dialog.edit.title', { item: 'Topic' })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} >
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="title">{t(fieldsName + 'title')}</InputLabel>
                      <OutlinedInput
                        id="title"
                        type="text"
                        value={values?.title || ''}
                        name="title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'title')}
                        fullWidth
                        error={Boolean(touched.title && errors.title)}
                      />
                      {touched.title && errors.title && (
                        <FormHelperText error id="helper-text-title">
                          {errors.title}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }}>
                <AnimateButton>
                  <Button onClick={onClose}>{t('buttons.cancel')}</Button>
                </AnimateButton>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                  >
                    {t(buttonName + (isNew == true ? 'add' : 'edit'))}
                  </Button>
                </AnimateButton>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default AddOrEditTopic;
