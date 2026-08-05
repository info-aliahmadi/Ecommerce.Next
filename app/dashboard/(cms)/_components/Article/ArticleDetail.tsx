import { Avatar, Box, CardMedia, Chip, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { EventNote } from '@mui/icons-material';
import CONFIG from '@root/config';
import { Stack } from '@mui/system';
import moment from 'moment';
import ImageUpload from '@dashboard/_components/FileUpload/ImageUpload';
import SelectTopic from '../Topic/SelectTopic';
import SelectTag from '../Tag/SelectTag';
import { useLocale, useTranslations } from 'next-intl';
import { MRT_Row } from 'material-react-table';
import ArticleModel from '../../_types/Article/ArticleMode';
import { Locale } from '@root/locales/Language';
import { DateTimeViewer } from '@root/utils/DateViewer';

// ===============================|| COLOR BOX ||=============================== //
export default function ArticleDetail({ row }: Readonly<{ row: MRT_Row<ArticleModel> }>) {
  const t = useTranslations();
  let language = useLocale() as Locale;

  const fieldsName = 'fields.article.';
  return (
    <Grid container spacing={3} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} direction="row" sx={{ justifyContent: "center", alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
          <Stack>
            {row.original.previewImageId && <ImageUpload value={row.original.previewImageId} name={"previewImageId"} disabled={true} filePosterMaxHeight={300} />}
            {row.original.previewImageUrl && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <CardMedia component="img" height="100" image={row.original.previewImageUrl} alt="Preview" />
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={3} size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6}} direction="row"sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
          <Stack spacing={1}>
            <InputLabel htmlFor="subject">{t(fieldsName + 'subject')}</InputLabel>
            <OutlinedInput
              id="subject"
              type="text"
              value={row.original.subject}
              fullWidth
              disabled
              endAdornment={
                <Chip
                  variant="outlined"
                  color={row.original.isDraft == true ? 'warning' : 'primary'}
                  label={row.original.isDraft == true ? t(fieldsName + 'draft') : t(fieldsName + 'published')}
                  size="small"
                />
              }
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
          <Stack spacing={1}>
            <InputLabel htmlFor="body">{t(fieldsName + 'body')}</InputLabel>
            <div className="MuiOutlinedvid-notchedOutline" dangerouslySetInnerHTML={{ __html: row.original.body }} />
            <Grid size={12}>
              {t(fieldsName + 'writedBy') + ' : '}
              <Chip
                title={t(fieldsName + 'writer')}
                avatar={<Avatar src={CONFIG.AVATAR_BASEPATH + row.original.writer?.avatar} />}
                label={row.original.writer?.userName}
                variant="filled"
                size="small"
                sx={{ borderRadius: '16px' }}
              />{' '}
              <Chip
                icon={<EventNote />}
                title={t(fieldsName + 'registerDate')}
                label={DateTimeViewer(language, row.original.registerDate)}
                variant="filled"
                size="small"
                sx={{ borderRadius: '16px' }}
              />{' '}
              {row.original.editor?.userName && (
                <>
                  {t(fieldsName + 'editedBy') + ' : '}
                  <Chip
                    title={t(fieldsName + 'editor')}
                    avatar={<Avatar src={CONFIG.AVATAR_BASEPATH + row.original.editor?.avatar} />}
                    label={row.original.editor?.userName}
                    variant="filled"
                    size="small"
                    sx={{ borderRadius: '16px' }}
                  />{' '}
                  <Chip
                    icon={<EventNote />}
                    title={t(fieldsName + 'editDate')}
                    label={DateTimeViewer(language, row.original.editDate)}
                    variant="filled"
                    size="small"
                    sx={{ borderRadius: '16px' }}
                  />{' '}
                </>
              )}
            </Grid>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <Stack spacing={1}>
            <InputLabel htmlFor="publishDate">{t(fieldsName + 'publishDate')}</InputLabel>
            <OutlinedInput
              id="publishDate"
              type="text"
              value={DateTimeViewer(language, row.original.publishDate)}
              fullWidth
              disabled
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <Stack spacing={1}>
            <InputLabel htmlFor="topicsIds">{t(fieldsName + 'topicsIds')}</InputLabel>
            <SelectTopic disabled defaultValues={row.original.topicsIds} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <Stack spacing={1}>
            <InputLabel htmlFor="tags">{t(fieldsName + 'tags')}</InputLabel>
            <SelectTag defaultValues={row.original.tags || []} disabled={true} />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
