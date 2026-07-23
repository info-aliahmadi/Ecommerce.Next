import { useEffect, useState } from 'react';

// material-ui
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { strengthColor, strengthIndicator } from '@root/utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import Notify from '@dashboard/_components/@extended/Notify';
import setServerErrors from '@root/utils/setServerErrors';
import { Save } from '@mui/icons-material';
import AnimateButton from '@dashboard/_components/@extended/AnimateButton';
import AccountService from '@dashboard/(auth)/_service/AccountService';
import { useSession } from 'next-auth/react';
import ChangePassword from '../../_types/User/ChangePassword';
import AddPassword from '../../_types/User/AddPassword';

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  submit?: string;
}

interface AddPasswordFormValues {
  password: string;
  confirmPassword: string;
  submit?: string;
}

const ChangePasswordForm = () => {
  const t = useTranslations("");
  const [level, setLevel] = useState<any>();
  const { data: session } = useSession();
  const jwt = session?.accessToken;
  const accountService = new AccountService(jwt ?? "");

  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notify, setNotify] = useState<any>({ open: false, type: 'success', description: '' });

  useEffect(() => {
    const checkPassword = async () => {
      if (!jwt) return;
      setLoading(true);
      try {
        const res = await accountService.hasPassword();
        setHasPassword(res?.data ? res.data : false);
      } catch {
        setHasPassword(false);
      } finally {
        setLoading(false);
      }
    };
    checkPassword();
  }, [jwt]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const updatePasswordStrength = (value: any) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    updatePasswordStrength('');
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Add Password Form (user has no password)
  if (hasPassword === false) {
    return (
      <>
        <Notify notify={notify} setNotify={setNotify} />
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('pages.noPasswordInfo')}
        </Alert>
        <Formik
          enableReinitialize={true}
          initialValues={{ password: '', confirmPassword: '' } as AddPasswordFormValues}
          validationSchema={Yup.object().shape({
            password: Yup.string().max(255).required(t('validation.required-new-password') as string),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password')], t('validation.passwordMismatch') as string)
              .required(t('validation.required-new-password') as string)
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const addPasswordData: AddPassword = {
                email: session?.user?.email ?? '',
                password: values.password
              };
              await accountService.addPassword(addPasswordData);
              setNotify({ open: true, type: 'success', description: t('pages.passwordAdded') });
              setHasPassword(true);
              setStatus({ success: true });
            } catch (error: any) {
              setErrors(setServerErrors(error));
              setNotify({ open: true, type: 'error', description: error?.message || t('pages.passwordAddFailed') });
              setStatus({ success: false });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container direction="row" sx={{ justifyContent: "center" }}>
                <Grid container size={{ xs: 12, sm: 10, md: 12, lg: 10, xl: 10 }} spacing={2} sx={{ justifyContent: "center" }}>
                  <Grid size={{ xs: 12, sm: 10, md: 10, lg: 8, xl: 8 }}>
                    <Stack>
                      <InputLabel htmlFor="add-password">{t('pages.newPassword')}</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="add-password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password || ''}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          updatePasswordStrength(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="large"
                            >
                              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="******"
                        inputProps={{}}
                      />
                      {touched.password && errors.password && (
                        <FormHelperText error id="helper-text-add-password">
                          {errors.password}
                        </FormHelperText>
                      )}
                    </Stack>
                    <FormControl sx={{ mt: 2 }}>
                      <Grid container spacing={0} sx={{ alignItems: "center" }}>
                        <Grid size={12}>
                          <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="subtitle1" sx={{ fontSize: "0.75rem" }}>
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 10, md: 10, lg: 8, xl: 8 }}>
                    <Stack>
                      <InputLabel htmlFor="confirm-password">{t('pages.confirmPassword')}</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={values.confirmPassword || ''}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="large"
                            >
                              {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="******"
                        inputProps={{}}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <FormHelperText error id="helper-text-confirm-password">
                          {errors.confirmPassword}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container size={{ sm: 12, md: 12, lg: 12, xl: 12 }} sx={{ justifyContent: "center", mt: 2 }}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                  >
                    {t('pages.addPassword')}
                  </Button>
                </AnimateButton>
              </Grid>
            </form>
          )}
        </Formik>
      </>
    );
  }

  // Change Password Form (user has password)
  const changePasswordModel: ChangePassword = {
    newPassword: '',
    oldPassword: ''
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify} />
      <Formik
        enableReinitialize={true}
        initialValues={changePasswordModel}
        validationSchema={Yup.object().shape({
          oldPassword: Yup.string().max(255).required(t('validation.required-old-password') as string),
          newPassword: Yup.string().max(255).required(t('validation.required-new-password') as string)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await accountService.changePassword(values);
            setNotify({ open: true, type: 'success', description: t('pages.passwordChanged') });
            setStatus({ success: true });
          } catch (error: any) {
            setErrors(setServerErrors(error));
            setNotify({ open: true, type: 'error', description: error?.message || t('pages.passwordChangeFailed') });
            setStatus({ success: false });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container direction="row" sx={{ justifyContent: "center" }}>
              <Grid container size={{ xs: 12, sm: 10, md: 12, lg: 10, xl: 10 }} spacing={2} sx={{ justifyContent: "center" }}>
                <Grid size={{ xs: 12, sm: 10, md: 10, lg: 8, xl: 8 }}>
                  <Stack>
                    <InputLabel htmlFor="old-password">{t('fields.old-password')}</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.oldPassword && errors.oldPassword)}
                      id="old-password"
                      type="password"
                      value={values?.oldPassword || ''}
                      name="oldPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                    />
                    {touched.oldPassword && errors.oldPassword && (
                      <FormHelperText error id="helper-text-old-password">
                        {errors.oldPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 10, md: 10, lg: 8, xl: 8 }}>
                  <Stack>
                    <InputLabel htmlFor="new-password">{t('fields.new-password')}</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.newPassword && errors.newPassword)}
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={values?.newPassword || ''}
                      name="newPassword"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        updatePasswordStrength(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                      inputProps={{}}
                    />
                    {touched.newPassword && errors.newPassword && (
                      <FormHelperText error id="helper-text-password-signup">
                        {errors.newPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                  <FormControl sx={{ mt: 2 }}>
                    <Grid container spacing={0} sx={{ alignItems: "center" }}>
                      <Grid size={12}>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid size={12}>
                        <Typography variant="subtitle1" sx={{ fontSize: "0.75rem" }}>
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid container size={{ sm: 12, md: 12, lg: 12, xl: 12 }} sx={{ justifyContent: "center" }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                >
                  {t('buttons.change-password')}
                </Button>
              </AnimateButton>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangePasswordForm;
