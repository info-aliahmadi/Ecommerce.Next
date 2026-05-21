// material-ui
import { Avatar, Box, Button, CardMedia, Chip, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Edit, Description, EventNote, Link } from '@mui/icons-material';
import CONFIG from '@root/config';
import { Stack } from '@mui/system';
import moment from 'moment';
import Notify from '@dashboard/_components/@extended/Notify';
import PagesService from '@dashboard/(cms)/_service/PagesService';
import SelectTag from '../Tag/SelectTag';
import { useRouter } from 'next/navigation';
import DeletePage from './DeletePage';
import { useSession } from 'next-auth/react';
import { MRT_Column } from '@root/app/types/MRT_Column';
import { MRT_Row } from 'material-react-table';
import PageModel from '../../_types/Page/PageModel';
import { GridDataBound } from '@root/app/types/GridDataBound';
import nextIntlService from '@root/locales/nextIntlService';
// ===============================|| COLOR BOX ||=============================== //

function PagesDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  let language = nextIntlService.getNextIntlLocale();

  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<PageModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const pagesService = new PagesService(jwt ?? '');

  const router = useRouter();

  const [fieldsName, buttonName] = ['fields.page.', 'buttons.page.'];

  const columns = useMemo<MRT_Column<PageModel>[]>(
    () => [
      {
        accessorKey: 'pageTitle',
        header: t(fieldsName + 'pageTitle'),
        enableClickToCopy: true,
        type: 'string',
        enableResizing: true
      },
      {
        accessorKey: 'subject',
        header: t(fieldsName + 'subject'),
        enableClickToCopy: true,
        type: 'string',
        enableResizing: true
      },
      {
        accessorKey: 'writer',
        header: t(fieldsName + 'writer'),
        enableClickToCopy: true,
        type: 'string',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<PageModel> }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            {row.original.writer?.name}
          </Box>
        )
      },
      {
        accessorKey: 'editor',
        header: t(fieldsName + 'editor'),
        enableClickToCopy: true,
        type: 'string',
        enableResizing: true,
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<PageModel> }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            {row.original.editor?.name}
          </Box>
        )
      },
      {
        accessorKey: 'registerDate',
        header: t(fieldsName + 'registerDate'),
        type: 'dateTime'
      }
    ],
    []
  );
  const handleDeleteRow = (row: MRT_Row<PageModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handlePageList = useCallback(async (filters: GridDataBound) => {
    return await pagesService.getPageList(filters);
  }, []);
  const AddRow = useCallback(
    () => (
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          router.push('/dashboard/page/add/0');
        }}
        startIcon={<Description />}
      >
        {t(buttonName + 'add')}
      </Button>
    ),
    []
  );
  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<PageModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.edit')}>
          <IconButton
            onClick={() => {
              router.push('/dashboard/page/edit/' + row.original.id);
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.visitorlink')}>
          <IconButton
            target='_blank'
            href={CONFIG.DOMAIN + "/page/" + row.original.id + "/" + row.original.pageTitle}
          >
            <Link />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );
  const PageDetail = ({ row }: { row: MRT_Row<PageModel> }) => {
    return (
      <Grid container spacing={3} direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid
          container
          item
          spacing={3}
          xs={12}
          sm={6}
          md={6}
          lg={6}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="pageTitle">{t(fieldsName + 'pageTitle')}</InputLabel>
              <OutlinedInput
                id="pageTitle"
                type="text"
                value={row.original.pageTitle}
                fullWidth
                disabled
                startAdornment={<InputAdornment position="start">{CONFIG.FRONT_PATH + '/Page/'}</InputAdornment>}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="subject">{t(fieldsName + 'subject')}</InputLabel>
              <OutlinedInput id="subject" type="text" value={row.original.subject} fullWidth disabled />
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="body">{t(fieldsName + 'body')}</InputLabel>
              <div className="MuiOutlinedvid-notchedOutline" dangerouslySetInnerHTML={{ __html: row.original.body }} />
              <Grid>
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
                  label={row.original.registerDate
                    ? new Intl.DateTimeFormat(language, {
                      dateStyle: 'long',
                      timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                      hour12: false
                    }).format(moment(row.original.registerDate).toDate()) : ''}
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
                      label={row.original.registerDate
                        ? new Intl.DateTimeFormat(language, {
                          dateStyle: 'long',
                          timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                          hour12: false
                        }).format(moment(row.original.editDate).toDate()) : ''}
                        
                      variant="filled"
                      size="small"
                      sx={{ borderRadius: '16px' }}
                    />{' '}
                  </>
                )}
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="tags">{t(fieldsName + 'tags')}</InputLabel>
              <SelectTag defaultValues={row.original.tags || []} disabled={true} />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MainCard title={<AddRow />}>
        <TableCard>
          <MaterialTable
            refetch={refetch}
            columns={columns}
            dataApi={handlePageList}
            enableRowActions={true}
            renderRowActions={DeleteOrEdit}
            // renderTopToolbarCustomActions={AddRow}
            renderDetailPanel={({ row }) => <PageDetail row={row} />}
          />
        </TableCard>
      </MainCard>
      <DeletePage row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default PagesDataGrid;
