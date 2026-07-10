import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

// material-ui
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Stack,
    IconButton,
    OutlinedInput,
    InputLabel,
    FormControl,
    FormHelperText,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import ProductTagService from '../../_service/ProductTagService';
import ProductTagModel from '../../_types/Product/ProductTagModel';

// validation schema
const validationSchema = yup.object({
    name: yup.string().required('Name is required')
});

const AddOrEditProductTag = ({
    row,
    open,
    setOpen,
    isNew,
    refetch
}: {
    row?: MRT_Row<ProductTagModel>;
    open: boolean;
    setOpen: (open: boolean) => void;
    isNew: boolean;
    refetch: () => void;
}) => {
    const t = useTranslations("");
    const [notify, setNotify] = useState<NotifyProps>({ open: false });
    const { data: session } = useSession();
    const jwt = session?.accessToken;
    let productTagService = new ProductTagService(jwt ?? '');

    const formik = useFormik({
        initialValues: {
            id: 0,
            name: '',
            key: '',
            products: 0
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (isNew) {
                productTagService
                    .addProductTag(values)
                    .then(() => {
                        handleClose();
                        setNotify({ open: true });
                        refetch();
                    })
                    .catch((error: any) => {
                        setNotify({ open: true, type: 'error', description: error });
                    });
            } else {
                productTagService
                    .updateProductTag(values)
                    .then(() => {
                        handleClose();
                        setNotify({ open: true });
                        refetch();
                    })
                    .catch((error: any) => {
                        setNotify({ open: true, type: 'error', description: error });
                    });
            }
        }
    });

    // Update form values when row or isNew changes
    useEffect(() => {
        if (open) {
            if (!isNew && row?.original) {
                formik.setValues({
                    id: row.original.id,
                    name: row.original.name,
                    key: row.original.key,
                    products: row.original.products
                });
            } else {
                formik.setValues({
                    id: 0,
                    name: '',
                    key: '',
                    products: 0
                });
            }
        }
    }, [row, isNew, open]);

    const handleClose = () => {
        formik.resetForm();
        setOpen(false);
    };

    // Dialog header
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
            <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" maxWidth="md">
                <form onSubmit={formik.handleSubmit}>
                    <DialogTitle id="scroll-dialog-title">
                        <Typography component="div" variant="h4">{isNew ? t(`dialog.productTag.add`) : t(`dialog.edit.title`, { item: `"${row?.original?.name}"` })}</Typography>
                        <CloseDialog onClose={handleClose} />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 0.25 }}>
                            <Grid size={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">{t('fields.productTag.name')}</InputLabel>
                                    <OutlinedInput
                                        id="name"
                                        type="text"
                                        value={formik.values.name}
                                        name="name"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder={t('fields.productTag.name')}
                                        fullWidth
                                        error={Boolean(formik.touched.name && formik.errors.name)}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {formik.errors.name}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>   <Grid size={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="key">{t('fields.productTag.key')}</InputLabel>
                                    <OutlinedInput
                                        id="key"
                                        type="text"
                                        value={formik.values.key}
                                        name="key"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        placeholder={t('fields.productTag.key')}
                                        fullWidth
                                        error={Boolean(formik.touched.key && formik.errors.key)}
                                    />
                                    {formik.touched.key && formik.errors.key && (
                                        <FormHelperText error id="standard-weight-helper-text-key">
                                            {formik.errors.key}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: '1.25rem' }}>
                        <Button onClick={handleClose}>{t('buttons.cancel')}</Button>
                        <Button disableElevation disabled={formik.isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                            {isNew ? t('buttons.productTag.add') : t('buttons.productTag.save')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddOrEditProductTag; 