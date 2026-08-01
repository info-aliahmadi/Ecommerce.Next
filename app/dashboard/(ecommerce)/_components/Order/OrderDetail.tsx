'use client';
import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useTranslations } from 'next-intl';

import OrderChangeStatus from './OrderChangeStatus';
import OrderShipment from './OrderShipment';
import OrderItems from './OrderItems';

import { MRT_Row } from 'material-react-table';
import OrderModel from '../../_types/Order/OrderModel';

export default function OrderDetail({ row, refetch }: Readonly<{ row: MRT_Row<OrderModel>; refetch: () => void }>) {
  const t = useTranslations('');
  const [expanded, setExpanded] = useState<string[]>(['status']);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded((prev) => {
      if (isExpanded) {
        return prev.includes(panel) ? prev : [...prev, panel];
      }
      return prev.filter((p) => p !== panel);
    });
  };

  return (
    <>
      <Accordion expanded={expanded.includes('status')} onChange={handleChange('status')} sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-status-content" id="panel-status-header">
          {t('fields.order.tabs.status')}
        </AccordionSummary>
        <AccordionDetails>
          <OrderChangeStatus row={row} refetch={refetch} />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded.includes('shipment')} onChange={handleChange('shipment')} sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-shipment-content" id="panel-shipment-header">
          {t('fields.order.tabs.shipment')}
        </AccordionSummary>
        <AccordionDetails>
          <OrderShipment
            order={row.original}
            shipmentId={row.original.shipmentId}
            refetch={refetch}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded.includes('items')} onChange={handleChange('items')} sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-items-content" id="panel-items-header">
          {t('fields.order.tabs.items')}
        </AccordionSummary>
        <AccordionDetails>
          <OrderItems orderId={row.original.id} currency={row.original.userCurrencyType} />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
