import { Button, Chip, Grid, InputLabel, Link, OutlinedInput, Stack, Tooltip, Typography } from '@mui/material';
import { ArrowBack, Reply, EventNote, Person } from '@mui/icons-material';

import AnimateButton from '@dashboard/_components/@extended/AnimateButton';

import MainCard from '@dashboard/_components/MainCard';

import CONFIG from '@root/config';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import FileUpload from '@dashboard/_components/FileUpload/FileUpload';
import EmailInboxModel from '../../../_types/EmailInboxModel';
import nextIntlService from '@root/locales/nextIntlService';

export default function ViewEmailInbox({ emailInbox }: Readonly<{ emailInbox: EmailInboxModel }>) {
  const [fieldsName, buttonName] = ['fields.email.emailInbox.', 'buttons.email.emailInbox.'];
  const router = useRouter();
  const t = useTranslations("");
  let language = nextIntlService.getNextIntlLocale();
  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }} key={emailInbox.id}>
      <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} spacing={3} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.emailInboxs')}</Typography>
        </Grid>
        <Grid size={12}>
          <MainCard>
            <Grid container spacing={3} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
              <Grid container spacing={3} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 8 }}>
                <Grid size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 10 }}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="fromAddress">{t(fieldsName + 'fromAddress')}</InputLabel>
                    {emailInbox?.fromAddress.map((fromAddress, index) => {
                      return <Link key={index} display="block">
                        <Tooltip title={t('tooltips.reply')}>
                          <Chip
                            onClick={() => {
                              router.push('/dashboard/email/send/' + fromAddress?.address);
                            }}
                            icon={<Person />}
                            title={t(fieldsName + 'fromAddress')}
                            label={fromAddress?.address}
                            variant="filled"
                            size="medium"
                            sx={{ borderRadius: '16px' }}
                          />
                        </Tooltip>
                      </Link>
                    })}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="subject">{t(fieldsName + 'subject')}</InputLabel>
                    <OutlinedInput
                      id="subject"
                      name="subject"
                      type="text"
                      value={emailInbox?.subject || ''}
                      placeholder={t(fieldsName + 'subject')}
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Stack spacing={1}>
                    <div className="MuiOutlinedvid-notchedOutline" dangerouslySetInnerHTML={{ __html: emailInbox?.content }} />
                    <Grid size={12}>
                      <Tooltip title={t(fieldsName + 'registerDate')}>
                        <Chip
                          icon={<EventNote />}
                          title={t(fieldsName + 'registerDate')}
                          label={emailInbox?.registerDate
                            ? new Intl.DateTimeFormat(language, {
                              dateStyle: 'long',
                              timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                              hour12: false
                            }).format(moment(emailInbox?.registerDate).toDate()) : ''}
                          variant="filled"
                          size="small"
                          sx={{ borderRadius: '16px' }}
                        />
                      </Tooltip>

                      <Tooltip title={t(fieldsName + 'date')}>
                        <Chip
                          icon={<EventNote />}
                          title={t(fieldsName + 'date')}
                          label={emailInbox?.date
                            ? new Intl.DateTimeFormat(language, {
                              dateStyle: 'long',
                              timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                              hour12: false
                            }).format(moment(emailInbox?.date).toDate()) : ''}
                          variant="filled"
                          size="small"
                          sx={{ borderRadius: '16px' }}
                        />
                      </Tooltip>

                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3} size={12} xl={4} sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                <Grid size={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="attachments">{t(fieldsName + 'attachments')}</InputLabel>
                    <FileUpload
                      id="attachments"
                      name="attachments"
                      value={emailInbox?.attachments || []}
                      allowMultiple={true}
                      disabled={true}
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
                        size="large"
                        type="submit"
                        variant="contained"
                        color="info"
                        onClick={() => {
                          router.push('/dashboard/email/send/0/' + emailInbox?.fromAddress.map(x => x.address).toString());
                        }}
                        startIcon={<Reply />}
                      >
                        {t(buttonName + 'reply')}
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
  );
}
