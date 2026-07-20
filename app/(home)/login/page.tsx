'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// material-ui
import { Box, Typography, Link, Button, Paper, Alert, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

// project import
import Notify from '@dashboard/_components/@extended/Notify';
import './page.css'
import CONFIG from '@root/config';
// ============================|| LOGIN ||============================ //

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError('Invalid username or password');
        return;
      }
      
      if (callbackUrl != "/") {
        router.push(callbackUrl);
      } else {
        router.push(CONFIG.DASHBOARD_PATH);
      }
      router.refresh();

    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  function SignUpLink() {
    return (
      <Link href="/" variant="body2">
        Sign up
      </Link>
    );
  }

  function ForgotPasswordLink() {
    return (
      <Link href="/" variant="body2">
        Forgot password?
      </Link>
    );
  }
  const BRANDING = {
    logo: (
      <img
        src="/images/apple-touch-icon.png"
        alt="MUI logo"
        style={{ height: 24 }}
      />
    ),
    title: 'MUI',
  };

  return (
    <>
      <Grid
        container
        direction="row"
        sx={{
          minHeight: '100vh'
        }}
      >
        {/* <Notify notify={notify} setNotify={setNotify} /> */}
        {/* Right Side - Login Form */}
        <Grid
          size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            backgroundColor: 'background.default',
          }}
        >
          <Grid className='main' sx={{ width: '100%' }}>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                px: 2,
              }}
            >
              <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Use your account credentials to continue.
                </Typography>

                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />

                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                  <Link href="/" underline="hover">
                    Back to home
                  </Link>
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
        {/* Left Side - Image/Video */}
        <Grid
          size={{ xs: 12, sm: 12, md: 6, lg: 8, xl: 8 }}
          sx={{
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/images/OnWaveLogo.png"
              alt="Cashier Next"
              fill
              style={{
                objectFit: 'contain',
                opacity: 0.8,
              }}
              priority
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
              }}
            />
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                color: 'white',
                p: 3,
              }}
            >
              <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Welcome to Hydra Cashier System
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Your complete point of sale solution
              </Typography>
            </Box>
          </Grid>
        </Grid>

      </Grid >
    </>
  );
};

export default Login;