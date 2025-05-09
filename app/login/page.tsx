'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

// material-ui
import { Box, Container, Typography } from '@mui/material';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// project import
import Notify from '@dashboard/_components/@extended/Notify';

// ============================|| LOGIN ||============================ //

const Login = () => {
  const router = useRouter();
  const [t] = useTranslation();
  const [notify, setNotify] = useState<NotifyProps>({ open: false, description: '', type: 'success' });

  const login: (provider: AuthProvider, formData: FormData) => void = async (
    provider,
    formData,
  ) => {
    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        setNotify({ open: true, description: t('validation.required-email'), type: 'error' });
        return;
      }

      const result = await signIn('credentials', {
        username: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setNotify({ open: true, description: t('validation.invalid-credentials'), type: 'error' });
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setNotify({ open: true, description: t('validation.error-occurred'), type: 'error' });
    }
  };

  const providers: AuthProvider[] = [
    {
      id: 'credentials',
      name: 'Email and Password',
    },
  ];

  return (
    <Container component="main" maxWidth="xs">
      <Notify notify={notify} setNotify={setNotify} />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            mb: 2,
          }}
        >
          <LockOutlinedIcon />
        </Box>
        <Typography component="h1" variant="h5">
          {t('login.title')}
        </Typography>
        <Box component="div" sx={{ mt: 1 }}>
          <SignInPage
            signIn={login}
            providers={providers}
            slotProps={{ 
              emailField: { autoFocus: true }, 
              passwordField: { autoFocus: false }, 
              form: { noValidate: true } 
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;