import { Avatar, Box, Button, IconButton, Tooltip } from '@mui/material';

import MainCard from '@dashboard/_components/MainCard';
import TableCard from '@dashboard/_components/TableCard';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialTable from '@dashboard/_components/MaterialTable/MaterialTable';
import {
  Edit,
  Slideshow,
  Delete,
  Save,
  ImageNotSupported,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import Notify from '@dashboard/_components/@extended/Notify';
import { Stack } from '@mui/system';
import CONFIG from '@root/config';
import SlideshowService from '@dashboard/(cms)/_service/SlideshowService';
import AddOrEditSlideshow from './AddOrEditSlideshow';
import DeleteSlideshow from './DeleteSlideshow';
import { useSession } from 'next-auth/react';
import { MRT_Row } from 'material-react-table';
import { MRT_Column } from '@root/app/types/MRT_Column';
import SlideshowModel from '../../_types/Slideshow/SlideshowModel';
import FileUploadModel from '@root/app/dashboard/(filestorage)/_types/FileUploadModel';
import { GetImage } from '@root/app/(home)/_lib/utils';

function SlideshowDataGrid() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const slideshowService = new SlideshowService(jwt ?? '');
  const [isNew, setIsNew] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [row, setRow] = useState<MRT_Row<SlideshowModel>>();
  const [refetch, setRefetch] = useState<number | undefined>(undefined);
  const [data, setData] = useState<SlideshowModel[]>([]);
  const [notify, setNotify] = useState<NotifyProps>({ open: false });
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  let mediaExtensions = CONFIG.IMAGES_EXTENSIONS.concat(CONFIG.VIDEOS_EXTENSIONS);

  const columns = useMemo<MRT_Column<SlideshowModel>[]>(
    () => [
      {
        accessorKey: 'previewImage',
        header: t('fields.slideshow.previewImage'),
        type: 'string',
        Cell: ({ row }: { row: MRT_Row<SlideshowModel> }) => <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {row.original.previewImageId ? (
            <Avatar
              variant="rounded"
              alt={row.original.description}
              src={GetImage(row.original.previewImage, true)}
              sx={{ width: 80, height: 80 }}
            ></Avatar>
          ) : (
            <Avatar variant="rounded">
              <ImageNotSupported />
            </Avatar>
          )}
        </Box>
      },
      {
        accessorKey: 'header',
        header: t('fields.slideshow.header'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'description',
        header: t('fields.slideshow.description'),
        enableClickToCopy: true,
        type: 'string'
      },
      {
        accessorKey: 'createDate',
        header: t('fields.slideshow.createDate'),
        enableClickToCopy: true,
        type: 'dateTime'
      },
      {
        accessorKey: 'user',
        header: t('fields.slideshow.user'),
        enableClickToCopy: true,
        type: 'string',
        Cell: ({ renderedCellValue, row }: { renderedCellValue: ReactNode; row: MRT_Row<SlideshowModel> }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            {row.original.user?.name}
          </Box>
        )
        // filterVariant: 'text' | 'select' | 'multi-select' | 'range' | 'range-slider' | 'checkbox',
      }
    ],
    []
  );
  useEffect(() => {
    loadSlideshowList();
  }, []);

  const handleNewRow = (row?: MRT_Row<SlideshowModel>) => {
    setIsNew(true);
    setRow(row);
    setOpen(true);
  };

  const handleSaveOrder = (slideshows: SlideshowModel[]) => {
    slideshowService
      .updateSlideshowOrders(slideshows)
      .then((result) => {
        setNotify({ open: true });
        setShowSaveBtn(false);
        handleRefetch();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };
  const handleEditRow = (row: MRT_Row<SlideshowModel>) => {
    setIsNew(false);
    setRow(row);
    setOpen(true);
  };
  const handleDeleteRow = (row: MRT_Row<SlideshowModel>) => {
    setRow(row);
    setOpenDelete(true);
  };
  const handleRefetch = () => {
    setRefetch(Date.now());
  };
  const loadSlideshowList = () => {
    slideshowService.getSlideshowList().then((result) => {
      result.data && setData(result.data);
      handleRefetch();
    });
  };

  const handleVisibleRow = (slideId: number) => {
    slideshowService
      .visibleSlideshow(slideId)
      .then(() => {
        loadSlideshowList();
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };
  const AddOrOrderRow = useCallback(
    (showSaveBtn: boolean, data: SlideshowModel[]) => (
      <Stack spacing={2} direction="row">
        <Button color="primary" onClick={() => handleNewRow()} variant="contained" startIcon={<Slideshow />}>
          {t('buttons.slideshow.add')}
        </Button>
        {showSaveBtn && (
          <Button color="info" onClick={() => handleSaveOrder(data)} variant="contained" startIcon={<Save />}>
            {t('buttons.slideshow.saveOrder')}
          </Button>
        )}
      </Stack>
    ),
    []
  );
  const DeleteOrEdit = useCallback(
    ({ row }: { row: MRT_Row<SlideshowModel> }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="top-start" title={t('buttons.slideshow.delete')}>
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top-start" title={t('buttons.slideshow.edit')}>
          <IconButton onClick={() => handleEditRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip
          arrow
          placement="right"
          title={row.original.isVisible ? t('buttons.slideshow.visibleOff') : t('buttons.slideshow.visible')}
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
      <MainCard title={AddOrOrderRow(showSaveBtn, data)}>
        <TableCard>
          <MaterialTable
            //key={'id' + refetch}
            dataSet={data}
            refetch={refetch}
            columns={columns}
            // dataApi={handleSlideshowList}
            enablePagination={false}
            enableColumnOrdering={false}
            enableColumnFilters={false}
            enableColumnResizing={false}
            enableBottomToolbar={false}
            enableGlobalFilterModes={false}
            enableColumnFilterModes={false}
            enableRowActions
            renderRowActions={DeleteOrEdit}
            // renderTopToolbarCustomActions={() => AddOrOrderRow(showSaveBtn, data)}
            enableRowOrdering={true}
            autoResetPageIndex={false}
            muiTableBodyRowDragHandleProps={({ table }: { table: any }) => ({
              onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow) {
                  data.splice(hoveredRow.index, 0, data.splice(draggingRow.index, 1)[0]);
                  setData([...data]);
                  handleRefetch();
                  setShowSaveBtn(true);
                }
              }
            })}
          />
        </TableCard>
      </MainCard>
      <AddOrEditSlideshow isNew={isNew} row={row} open={open} setOpen={setOpen} refetch={loadSlideshowList} />
      <DeleteSlideshow row={row} open={openDelete} setOpen={setOpenDelete} refetch={loadSlideshowList} />
    </>
  );
}

export default SlideshowDataGrid;
