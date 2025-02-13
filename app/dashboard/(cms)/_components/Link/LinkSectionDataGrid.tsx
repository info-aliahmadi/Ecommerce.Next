// material-ui
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';

// project import
import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Delete, Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import AddOrEditLinkSection from './AddOrEditLinkSection';
import DeleteLinkSection from './DeleteLinkSection';

import AddIcon from '@mui/icons-material/Add';
import LinkDataGrid from './LinkDataGrid';
import LinkSectionService from '@dashboard/(cms)/_service/LinkSectionService';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import Notify from '@root/app/dashboard/_components/@extended/Notify';
// ===============================|| COLOR BOX ||=============================== //

function LinkSectionDataGrid() {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const linkSectionService = new LinkSectionService(jwt ?? '');

  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<LinkSectionModel[] | undefined>();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<LinkSectionModel>>();
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const [refetch, setRefetch] = useState<number | undefined>(undefined);

  const columns = useMemo<MRT_Column<LinkSectionModel>[]>(
    () => [
      {
        accessorKey: 'key',
        header: t('fields.linkSection.key'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'title',
        header: t('fields.linkSection.title'),
        type: 'string'
      }
    ],
    []
  );

  useEffect(() => {
    loadLinkSectionList();
  }, []);

  const loadLinkSectionList = () => {
    linkSectionService.getLinkSectionList().then((result) => {
      setData(result.data);
      handleRefetch();
    });
  };

  const handleNewRow = () => {
    setIsNew(true);
    setRow(undefined);
    setOpen(true);
  };
  const handleEditRow = (row: MRT_Row<LinkSectionModel>) => {
    setIsNew(false);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<LinkSectionModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handleVisibleRow = (linkSectionId: number) => {
    linkSectionService
      .visibleLinkSection(linkSectionId)
      .then(() => {
        loadLinkSectionList();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };

  const AddRow = useCallback(
    () => (
      <Button color="primary" onClick={handleNewRow} variant="contained" startIcon={<AddIcon />}>
        {t('buttons.linkSection.add')}
      </Button>
    ),
    []
  );

  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<LinkSectionModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.linkSection.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.linkSection.edit')}>
          <IconButton onClick={() => handleEditRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>

        <Tooltip
          arrow
          placement="right"
          title={row.original.isVisible ? t('buttons.linkSection.visibleOff') : t('buttons.linkSection.visible')}
        >
          <IconButton onClick={() => handleVisibleRow(row.original.id)} color={row.original.isVisible ? 'secondary' : 'warning'}>
            {row.original.isVisible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );
  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MainCard title={<AddRow />}>
        <TableCard>
          <MaterialTable
            dataSet={data}
            refetch={refetch}
            columns={columns}
            enablePagination={false}
            enableColumnOrdering={false}
            enableColumnFilters={false}
            enableColumnResizing={false}
            enableBottomToolbar={false}
            enableSorting={false}
            enableGlobalFilterModes={false}
            enableColumnFilterModes={false}
            autoResetPageIndex={false}
            enableRowActions
            renderRowActions={DeleteOrEdit}
            // renderTopToolbarCustomActions={AddRow}
            renderDetailPanel={({ row }) => <LinkDataGrid linkSection={row} />}
          />
        </TableCard>
      </MainCard>
      <AddOrEditLinkSection isNew={isNew} row={row} open={open} setOpen={setOpen} refetch={loadLinkSectionList} />
      <DeleteLinkSection row={row} open={openDelete} setOpen={setOpenDelete} refetch={loadLinkSectionList} />
    </>
  );
}

export default LinkSectionDataGrid;
