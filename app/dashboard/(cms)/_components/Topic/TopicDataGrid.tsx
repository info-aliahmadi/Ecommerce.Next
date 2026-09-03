import { Box, Button, IconButton, Tooltip } from '@mui/material';

import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import { Edit, Topic, Add, Delete, Link } from '@mui/icons-material';
import AddOrEditTopic from './AddOrEditTopic';
import DeleteTopic from './DeleteTopic';
import TopicsService from '@dashboard/(cms)/_service/TopicService';
import { useSession } from 'next-auth/react';
import CONFIG from '@root/config';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import TopicModel from '../../_types/Topic/TopicModel';
function TopicDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const service = new TopicsService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<TopicModel>>();
  const [data, setData] = useState<TopicModel[]>([]);
  const [refetch, setRefetch] = useState<number | undefined>(undefined);

  const columns = useMemo<MRT_Column<TopicModel>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Topic Name',
        enableClickToCopy: true,
        type: 'string'
        // filterVariant: 'text' | 'select' | 'multi-select' | 'range' | 'range-slider' | 'checkbox',
      }
    ],
    []
  );

  const handleNewRow = (row? : MRT_Row<TopicModel>) => {
    setIsNew(true);
    setRow(row);
    setOpen(true);
  };
  const handleEditRow = (row : MRT_Row<TopicModel>) => {
    setIsNew(false);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<TopicModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };
  useEffect(() => {
    async function fetchData() {
      let data = await service.getTopicList();
      setData(data.data ?? []);
      handleRefetch();
    }

    fetchData();
  }, []);
  
  const AddRow = useCallback(
    () => (
      <Button color="primary" onClick={() => handleNewRow()} variant="contained" startIcon={<Topic />}>
        {t('buttons.topic.addMainTopic')}
      </Button>
    ),
    []
  );
  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<TopicModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.topic.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.topic.edit')}>
          <IconButton onClick={() => handleEditRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.topic.addSubTopic')}>
          <IconButton onClick={() => handleNewRow(row)}>
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.visitorlink')}>
          <IconButton
            target='_blank'
            href={CONFIG.DOMAIN + "/blogcategory/" + row.original.title}>
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
            dataSet={data}
            enableExpanding={true}
            enableExpandAll={true}
            getSubRows={(originalRow) => originalRow.childs}
            enablePagination={false}
            enableColumnOrdering={false}
            enableColumnFilters={false}
            enableColumnResizing={false}
            enableBottomToolbar={false}
            enableGlobalFilterModes={false}
            enableColumnFilterModes={false}
            enableRowActions
            renderRowActions={DeleteOrEdit}
            displayColumnDefOptions={{
              'mrt-row-actions': {
                size: 180,
                minSize: 180,
                maxSize: 180,
              },
            }}
          // renderTopToolbarCustomActions={AddRow}
          />
        </TableCard>
      </MainCard>
      <AddOrEditTopic isNew={isNew} row={row} open={open} setOpen={setOpen} refetch={handleRefetch} />
      <DeleteTopic row={row} open={openDelete} setOpen={setOpenDelete} refetch={handleRefetch} />
    </>
  );
}

export default TopicDataGrid;
