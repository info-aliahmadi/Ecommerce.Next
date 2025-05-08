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
import { useTranslation } from 'react-i18next';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import TagsService from '@dashboard/(cms)/_service/TagsService';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import TagModel from '../../_types/Tag/TagModel';

const AddOrEditTag = ({ row, isNew, open, setOpen, refetch }:
  {
    row?: MRT_Row<TagModel>,
    isNew: boolean,
    open: boolean,
    setOpen: (open: boolean) => void,
    refetch: () => void
  }) => {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let tagService = new TagsService(jwt ?? '');
  const [fieldsName, validation, buttonName] = ['fields.tag.', 'validation.tag.', 'buttons.tag.'];
  const [tag, setTag] = useState<TagModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const loadTag = () => {
    let tagId = row?.original?.id;
    tagId && tagService.getTagById(tagId).then((result) => {
      setTag(result.data);
    });
  };
  const onClose = () => {
    setOpen(false);
    setTag(undefined);
  };
  useEffect(() => {
    if (isNew == false && row) {
      loadTag();
    } else {
      setTag(undefined);
    }
  }, [row, isNew, open]);

  const handleSubmit = (tag : TagModel, setErrors: (errors: FormikErrors<TagModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (isNew == true) {
      tagService
        .addTag(tag)
        .then(() => {
          setTag(undefined);
          onClose();
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        }).finally(() => {
          setSubmitting(false);
        });
    } else {
      tagService
        .updateTag(tag)
        .then(() => {
          setTag(undefined);
          onClose();
          setNotify({ open: true });
          refetch();
        })
        .catch((error) => {
          setNotify({ open: true, type: 'error', description: error });
          setErrors(setServerErrors(error));
        }).finally(() => {
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
  const initialValues: TagModel = {
    id: tag?.id ?? 0,
    title: tag?.title ?? ''
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
              .required(t(validation + 'requiredTagTitle'))
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
                {isNew == true ? t('dialog.tag.add') : t('dialog.edit.title', { item: values.title })}
                <CloseDialog onClose={onClose} />
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} direction="column">
                  <Grid item>
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
                  <Button onClick={onClose}>Cancel</Button>
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

export default AddOrEditTag;
