import { Box, Button, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Edit, RestoreFromTrash, PostAddOutlined, PushPin, Link } from '@mui/icons-material';
import DeleteArticle from './DeleteArticle';
import Notify from '@dashboard/_components/@extended/Notify';
import ArticlesService from '@dashboard/(cms)/_service/ArticlesService';
import { useRouter } from 'next/navigation';
import ArticleDetail from './ArticleDetail';
import { useSession } from 'next-auth/react';
import CONFIG from '@root/config';
import { MRT_Cell, MRT_Row } from 'material-react-table';
import MRT_Column from '@root/app/types/MRT_Column';

import ArticleModel from '../../_types/Article/ArticleMode';


// ===============================|| COLOR BOX ||=============================== //
export function ArticlesDataGrid() {
  const [t, i18n] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<ArticleModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  const articlesService = new ArticlesService(jwt ?? '');

  const router = useRouter();

  const [fieldsName, buttonName] = ['fields.article.', 'buttons.article.'];

  const columns = useMemo<MRT_Column<ArticleModel>[]>(
    () => [
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
        Cell: ({ row }: { row: MRT_Row<ArticleModel> }) => (
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
        Cell: ({ row }: { row: MRT_Row<ArticleModel> }) => (
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
        accessorKey: 'publishDate',
        header: t(fieldsName + 'publishDate'),
        type: 'dateTime'
      },
      {
        accessorKey: 'registerDate',
        header: t(fieldsName + 'registerDate'),
        type: 'dateTime'
      },
      {
        accessorKey: 'isDraft',
        header: t(fieldsName + 'isDraft'),
        type: 'boolean',
        enableResizing: true,
        maxSize: 100,
        Cell: ({ row }: { row: MRT_Row<ArticleModel> }) => (
          <Chip
            variant="outlined"
            color={row.original.isDraft ? 'warning' : 'primary'}
            // icon={<>{renderedCellValue == true ? 'Published' : 'Draft'}</>}
            label={row.original.isDraft ? t(fieldsName + 'draft') : t(fieldsName + 'published')}
            // sx={{ ml: 1.25, pl: 1 }}
            size="small" />
        )
      }
    ],
    []
  );
  const handleDeleteRow = (row: MRT_Row<ArticleModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handlePinRow = (articleId : number) => {
    articlesService
      .pinArticle(articleId)
      .then(() => {
        handleRefetch();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };
  const handleArticleList = useCallback(async (filters: GridDataBound) => {
    return await articlesService.getArticleList(filters);
  }, []);
  const AddRow = useCallback(
    () => (
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          router.push('/dashboard/article/add/0');
        }}
        startIcon={<PostAddOutlined />}
      >
        {t(buttonName + 'add')}
      </Button>
    ),
    []
  );
  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<ArticleModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.edit')}>
          <IconButton
            onClick={() => {
              router.push('/dashboard/article/edit/' + row.original.id);
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.pin')}>
          <IconButton onClick={() => handlePinRow(row.original.id)} color={row.original.isPinned ? 'warning' : 'secondary'}>
            <PushPin />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.visitorlink')}>
          <IconButton
            target='_blank'
            href={CONFIG.DOMAIN + "/blogpost/" + row.original.id + "/" + row.original.subject}
          >
            <Link />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );

  const ArticleHeader = () => {
    return (
      <Grid container item direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <AddRow />
        </Grid>
        <Grid item>
          <Chip
            href="/dashboard/article/trash-list"
            clickable
            component="a"
            target="_blank"
            icon={<RestoreFromTrash />}
            title={t('pages.articlesTrash')}
            label={t(buttonName + 'trash')}
            variant="outlined"
            size="medium"
            color="error"
            sx={{ borderRadius: '16px' }} />
        </Grid>
      </Grid>
    );
  };
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MainCard title={<ArticleHeader />}>
        <TableCard>
          <MaterialTable
            refetch={refetch}
            columns={columns}
            dataApi={handleArticleList}
            enableRowActions={true}
            renderRowActions={DeleteOrEdit}
            renderDetailPanel={({ row }) => <ArticleDetail row={row} />}
            displayColumnDefOptions={{
              'mrt-row-actions': {
                //header: 'Change Account Settings', //change header text
                size: 110 //make actions column wider
              }
            }} />
        </TableCard>
      </MainCard>
      <DeleteArticle row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}
