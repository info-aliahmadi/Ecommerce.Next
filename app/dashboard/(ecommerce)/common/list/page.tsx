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
// ===============================|| COLOR BOX ||=============================== //
function CommonList() {
  const t = useTranslations("");
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "flex-start" }}>
        <Grid container spacing={3} size={12} >
          <Grid size={12}>
            <Typography variant="h5">{t('pages.common')}</Typography>
          </Grid>
          <Grid size={12}>

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
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                  Users
                </Typography>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  You are currently not an owner
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                  varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                  laoreet.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                  Advanced settings
                </Typography>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  Filtering has been entirely disabled for whole web server
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                  amet egestas eros, vitae egestas augue. Duis vel est augue.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                  Personal data
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                  amet egestas eros, vitae egestas augue. Duis vel est augue.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default CommonList;
