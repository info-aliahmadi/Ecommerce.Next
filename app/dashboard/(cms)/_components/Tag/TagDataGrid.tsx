import { Box, Button, IconButton, Tooltip } from '@mui/material';

import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Edit, Tag, Add, Delete, Link } from '@mui/icons-material';
import TagsService from '@dashboard/(cms)/_service/TagsService';
import AddOrEditTag from './AddOrEditTag';
import DeleteTag from './DeleteTag';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import MRT_Column from '@root/app/types/MRT_Column';
import CONFIG from '@root/config';
import TagModel from '../../_types/Tag/TagModel';


function TagDataGrid() {
  const [t] = useTranslation();
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const service = new TagsService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<TagModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);

  const columns = useMemo<MRT_Column<TagModel>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('fields.tag.title'),
        enableClickToCopy: true,
        type: 'string'
        // filterVariant: 'text' | 'select' | 'multi-select' | 'range' | 'range-slider' | 'checkbox',
      }
    ],
    []
  );

  const handleNewRow = (row? : MRT_Row<TagModel>) => {
    setIsNew(true);
    setRow(row);
    setOpen(true);
  };
  const handleEditRow = (row : MRT_Row<TagModel>) => {
    setIsNew(false);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<TagModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };

  const handleTagList = useCallback(async (filters: GridDataBound) => {
    return await service.getTagList(filters);
  }, []);

  const AddRow = useCallback(
    () => (
      <Button color="primary" onClick={() => handleNewRow()} variant="contained" startIcon={<Tag />}>
        {t('buttons.tag.add')}
      </Button>
    ),
    []
  );
  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<TagModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.tag.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.tag.edit')}>
          <IconButton onClick={() => handleEditRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.visitorlink')}>
          <IconButton
            target='_blank'
            href={CONFIG.DOMAIN + "/blogtag/" + row.original.title}>
            <Link />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );
  return (
    <>
      <MainCard title={<AddRow />}>
        <TableCard>
          <MaterialTable
            refetch={refetch}
            columns={columns}
            dataApi={handleTagList}
            enableRowActions
            renderRowActions={DeleteOrEdit}
            // renderTopToolbarCustomActions={AddRow}
          />
        </TableCard>
      </MainCard>
      <AddOrEditTag isNew={isNew} row={row} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteTag row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default TagDataGrid;
