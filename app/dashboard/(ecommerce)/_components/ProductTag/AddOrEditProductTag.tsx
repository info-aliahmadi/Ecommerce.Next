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
    DialogContentText,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { useTranslation } from 'react-i18next';
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
    const [t] = useTranslation();
    const [notify, setNotify] = useState<NotifyProps>({ open: false });
    const { data: session } = useSession();
    const jwt = session?.accessToken;
    let productTagService = new ProductTagService(jwt ?? '');
    const productTag = row?.original;

    const formik = useFormik({
        initialValues: {
            id: productTag?.id ?? 0,
            name: productTag?.name ?? '',
            products: productTag?.products ?? 0
        },
        validationSchema,
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
                        <Typography variant="h4">{isNew ? t('titles.new_product_tag') : t('titles.edit_product_tag')}</Typography>
                        <CloseDialog onClose={handleClose} />
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                            <Grid container spacing={3} sx={{ mt: 0.25 }}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">{t('form.name')}</InputLabel>
                                        <OutlinedInput
                                            id="name"
                                            type="text"
                                            value={formik.values.name}
                                            name="name"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            placeholder={t('form.name')}
                                            fullWidth
                                            error={Boolean(formik.touched.name && formik.errors.name)}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {formik.errors.name}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: '1.25rem' }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button disableElevation disabled={formik.isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                            {isNew ? t('buttons.add') : t('buttons.save')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddOrEditProductTag; 