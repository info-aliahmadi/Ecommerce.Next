'use client';
// material-ui
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// project import
import { useTranslations } from 'next-intl';
import { Grid } from '@mui/material';
import DiscountDataGrid from '../../_components/Discount/DiscountDataGrid';
import StateProvinceDataGrid from '../../_components/StateProvince/StateProvinceDataGrid';
import TaxCategoryDataGrid from '../../_components/TaxCategory/TaxCategoryDataGrid';
import TaxRateDataGrid from '../../_components/TaxRate/TaxRateDataGrid';
// ===============================|| COLOR BOX ||=============================== //
function CommonList() {
  const t = useTranslations("");
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
      <Grid container spacing={3} size={12} >
        <Grid size={12}>
          <Typography variant="h5">{t('pages.common')}</Typography>
        </Grid>
        <Grid size={12}>

          <Accordion expanded={expanded === 'stateProvince'} onChange={handleChange('stateProvince')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                {t("pages.stateProvince")}
              </Typography>
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                {t("pages.stateProvince")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <StateProvinceDataGrid />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'discount'} onChange={handleChange('discount')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="discountbh-content"
              id="discountbh-header"
            >
              <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                {t("pages.discount")}
              </Typography>
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                {t("pages.discount")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DiscountDataGrid />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'taxCategory'} onChange={handleChange('taxCategory')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                {t("pages.taxCategory")}
              </Typography>
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                {t("pages.taxCategory")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TaxCategoryDataGrid />
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'taxRate'} onChange={handleChange('taxRate')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                {t("pages.taxRate")}
              </Typography>
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                {t("pages.taxRate")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TaxRateDataGrid />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CommonList;
