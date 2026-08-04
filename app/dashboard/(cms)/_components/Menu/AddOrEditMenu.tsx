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
import MenuService from '@dashboard/(cms)/_service/MenuService';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import MenuModel from '../../_types/Menu/MenuModel';

const AddOrEditMenu = ({ row, isNew, open, setOpen, refetch }:
  {
    row?: MRT_Row<MenuModel>,
    isNew: boolean,
    open: boolean,
    setOpen: (open: boolean) => void,
    refetch: () => void
  }) => {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let menuService = new MenuService(jwt ?? '');
  const [fieldsName, validation, buttonName] = ['fields.menu.', 'validation.menu.', 'buttons.menu.'];
  const [menu, setMenu] = useState<MenuModel>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const loadMenu = () => {
    row && menuService.getMenuById(row?.original?.id).then((result) => {
      setMenu(result.data);
    });
  };
  const onClose = () => {
    setOpen(false);
    setMenu(undefined);
  };
  useEffect(() => {
    if (isNew == false && row) {
      loadMenu();
    } else {
      setMenu(undefined);
    }
  }, [row, isNew, open]);

  const handleSubmit = (menu: MenuModel, setErrors: (errors: FormikErrors<MenuModel>) => void, setSubmitting: (open: boolean) => void) => {
    if (isNew == true) {
      menuService
        .addMenu(menu)
        .then(() => {
          setMenu(undefined);
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
      menuService
        .updateMenu(menu)
        .then(() => {
          setMenu(undefined);
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
  const initialValues: MenuModel = {
    id: menu?.id ?? 0,
    title: menu?.title ?? '',
    url: menu?.url ?? '',
    color: menu?.color ?? '',
    previewImageId: menu?.previewImageId,
    parentId: row && isNew == true ? row?.original?.id : menu?.parentId,
    isEdited : false,
    order : 0,
    userId : 0,
    userName : ''
  }
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <Dialog open={open} fullWidth={true}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t(validation + 'requiredMenuTitle')),
            url: Yup.string()
              .max(255)
              .required(t(validation + 'requiredMenuUrl'))
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
          {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogTitle>
                {isNew == true
                  ? row
                    ? t('dialog.menu.addSub', { parentTitle: '"' + row?.original?.title + '"' })
                    : t('dialog.menu.addMain')
                  : t('dialog.edit.title', { item: values.title })}
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
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="url">{t(fieldsName + 'url')}</InputLabel>
                      <OutlinedInput
                        id="url"
                        type="text"
                        value={values?.url || ''}
                        name="url"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'url')}
                        fullWidth
                        error={Boolean(touched.url && errors.url)}
                        className="ltr-direction"
                      />
                      {touched.url && errors.url && (
                        <FormHelperText error id="helper-text-url">
                          {errors.url}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="color">{t(fieldsName + 'color')}</InputLabel>
                      <OutlinedInput
                        id="color"
                        type="text"
                        value={values?.color || ''}
                        name="color"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={t(fieldsName + 'color')}
                        fullWidth
                        error={Boolean(touched.color && errors.color)}
                      />
                      {touched.color && errors.color && (
                        <FormHelperText error id="helper-text-color">
                          {errors.color}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="previewImageId">{t(fieldsName + 'previewImageId')}</InputLabel>
                      <ImageUpload
                        name="previewImageId"
                        setFieldValue={setFieldValue}
                        value={values?.previewImageId || null}
                        filePosterMaxHeight={400}
                      />
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

export default AddOrEditMenu;
