import { ImageNotSupported } from "@mui/icons-material";
import { Avatar, Box, Chip, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, Switch, TextField } from "@mui/material";

import CurrencyViewer from '@root/utils/CurrencyViewer';
import { DateTimeViewer } from '@root/utils/DateViewer';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectProductAttribute from "../ProductAttribute/SelectProductAttribute";
import { useTranslations } from 'next-intl';
import CONFIG from '@root/config';
import ProductModel from '../../_types/Product/ProductModel';
import { MRT_Row } from 'material-react-table';
import nextIntlService from "@root/locales/nextIntlService";
import moment from "moment";

export default function ProductDetail({ row }: { row: MRT_Row<ProductModel> }) {

    const t = useTranslations("");
    const fieldsName = 'fields.product.';
    let language = nextIntlService.getNextIntlLocale();

    function AttributeInventory({ invenroty }: { invenroty: any }) {

        return <Grid item container spacing={1} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid item xs={4} sm={4} md={3} lg={3} xl={3} p={2}>
                <Stack>
                    <Chip label={invenroty.attributeName}></Chip>
                </Stack>
            </Grid>
            <Grid item xs={8} sm={8} md={6} lg={5} xl={5}>
                <Stack>
                    <TextField
                        disabled
                        type="number"
                        value={invenroty.stockQuantity || 0}
                        label={t(fieldsName + 'stockQuantity')}
                        fullWidth
                    />
                </Stack>
            </Grid>
        </Grid>
    }
    return (
        <Grid container spacing={3} direction="row">
            <Grid container item spacing={3} xs={12} sm={6} md={3} lg={3} direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12} md={12}>
                    <Stack>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                margin: '10px'
                            }}
                        >
                            {row.original.previewImage ? <Avatar
                                component="img"
                                variant="rounded"
                                loading="lazy"
                                alt="product Preview"
                                src={CONFIG.UPLOAD_BASEPATH + row.original.previewImage.directory + row.original.previewImage?.fileName}
                                sx={{ width: 200, height: 200 }}
                            ></Avatar> : <Avatar variant="rounded" sx={{ width: 200, height: 200 }}>
                                <ImageNotSupported />
                            </Avatar>
                            }
                            <span>{row.original.name}</span>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container item xs={12} sm={6} md={6} lg={6}>

                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        Base Info
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="deliveryDateName">{t(fieldsName + 'deliveryDateId')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        value={row.original.deliveryDateName || ''}
                                        size="medium"
                                        disabled
                                        defaultValue={row.original.deliveryDateName}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                <Chip label={selected} sx={{ height: '23px' }} />
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value={row.original.deliveryDateName}>
                                            <span style={{ 'whiteSpace': 'pre-wrap' }}>{row.original.deliveryDateName}</span>
                                        </MenuItem>
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="taxCategoryName">{t(fieldsName + 'taxCategoryId')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        value={row.original.taxCategoryName || ''}
                                        size="medium"
                                        disabled
                                        defaultValue={row.original.taxCategoryName}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                <Chip label={selected} sx={{ height: '23px' }} />
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value={row.original.taxCategoryName}>
                                            <span style={{ 'whiteSpace': 'pre-wrap' }}>{row.original.taxCategoryName}</span>
                                        </MenuItem>
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="price">{t(fieldsName + 'price')}</InputLabel>
                                    <OutlinedInput id="price" type="text" value={CurrencyViewer(row.original.price, row.original.currencyCode)} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="oldPrice">{t(fieldsName + 'oldPrice')}</InputLabel>
                                    <OutlinedInput id="oldPrice" type="text" value={CurrencyViewer(row.original.oldPrice, row.original.currencyCode)} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="categoryNames">{t(fieldsName + 'categoryIds')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        multiple
                                        value={row.original.categoryNames || ''}
                                        size="medium"
                                        disabled
                                        defaultValue={row.original.categoryNames?.filter((x) => row.original.categoryNames?.find((c) => c === x)) ?? []}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value, index) => {
                                                    return <Chip key={'chip-' + index} label={value} sx={{ height: '23px' }} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {row.original.categoryNames?.map((item) => {
                                            return (
                                                <MenuItem key={'menu-' + item} value={item}>
                                                    <span style={{ 'whiteSpace': 'pre-wrap' }}>{item}</span>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="manufacturerNames">{t(fieldsName + 'manufacturerIds')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        multiple
                                        value={row.original.manufacturerNames || ''}
                                        size="medium"
                                        disabled
                                        defaultValue={row.original.manufacturerNames?.filter((x) => row.original.manufacturerNames?.find((c) => c === x)) ?? []}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value, index) => {
                                                    return <Chip key={'chip-' + index} label={value} sx={{ height: '23px' }} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {row.original.manufacturerNames?.map((item) => {
                                            return (
                                                <MenuItem key={'menu-' + item} value={item}>
                                                    <span style={{ 'whiteSpace': 'pre-wrap' }}>{item}</span>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="availableStartDateTimeUtc">{t(fieldsName + 'availableStartDateTimeUtc')}</InputLabel>
                                    <OutlinedInput
                                        id="availableStartDateTimeUtc"
                                        type="text"
                                        value={row.original.availableStartDateTimeUtc
                                            ? new Intl.DateTimeFormat(language, {
                                                dateStyle: 'long',
                                                timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                                                hour12: false
                                            }).format(moment(row.original.availableStartDateTimeUtc).toDate()) : ''}

                                        fullWidth
                                        disabled
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="availableEndDateTimeUtc">{t(fieldsName + 'availableEndDateTimeUtc')}</InputLabel>
                                    <OutlinedInput
                                        id="availableEndDateTimeUtc"
                                        type="text"
                                        value={row.original.availableEndDateTimeUtc
                                            ? new Intl.DateTimeFormat(language, {
                                                dateStyle: 'long',
                                                timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                                                hour12: false
                                            }).format(moment(row.original.availableEndDateTimeUtc).toDate()) : ''}

                                        fullWidth
                                        disabled
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="attributeNames">{t(fieldsName + 'attributeIds')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        multiple
                                        value={row.original.attributeNames || ''}
                                        size="medium"
                                        disabled
                                        defaultValue={row.original.attributeNames?.filter((x) => row.original.attributeNames?.find((c) => c === x)) ?? []}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value, index) => {
                                                    return <Chip key={'chip-' + index} label={value} sx={{ height: '23px' }} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {row.original.attributeNames?.map((item) => {
                                            return (
                                                <MenuItem key={'menu-' + item} value={item}>
                                                    <span style={{ 'whiteSpace': 'pre-wrap' }}>{item}</span>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Stack>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        Inventory
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Stack>
                                    <InputLabel htmlFor="stockQuantity">{t(fieldsName + 'stockQuantity')}</InputLabel>
                                    <OutlinedInput id="stockQuantity" type="text" value={row.original.stockQuantity} fullWidth disabled />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Stack>
                                    <InputLabel htmlFor="minStockQuantity">{t(fieldsName + 'minStockQuantity')}</InputLabel>
                                    <OutlinedInput id="minStockQuantity" type="text" value={row.original.minStockQuantity} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Stack>

                                    <InputLabel htmlFor="orderMinimumQuantity">{t(fieldsName + 'orderMinimumQuantity')}</InputLabel>
                                    <OutlinedInput id="orderMinimumQuantity" type="text" value={row.original.orderMinimumQuantity} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Stack>

                                    <InputLabel htmlFor="orderMaximumQuantity">{t(fieldsName + 'orderMaximumQuantity')}</InputLabel>
                                    <OutlinedInput id="orderMaximumQuantity" type="text" value={row.original.orderMaximumQuantity} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Stack>
                                    <SelectProductAttribute
                                        id="attributeIds"
                                        name="attributeIds"
                                        label={t(fieldsName + 'attributeIds')}
                                        disabled={true}
                                        defaultValues={row.original?.inventories?.filter(x => x.stockType == 1).map(x => x.attributeId) || []}
                                        onChange={() => { }}
                                        setFieldValue={() => { }}
                                        error={false}
                                    />
                                </Stack>
                                <Stack>
                                    <Grid container spacing={1} xs={12} sm={12} md={12} lg={12} xl={12} pt={3}>
                                        {row.original?.inventories?.filter(x => x.stockType == 1).map((item, index) => <AttributeInventory key={index} invenroty={item} />)}
                                    </Grid>
                                </Stack>

                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={row.original?.notifyAdminForQuantityBelow}
                                            />
                                        }
                                        label="Notify Admin For Quantity Below"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={row.original?.allowedQuantities}
                                            />
                                        }
                                        label="Allowed Quantities"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={row.original?.displayStockQuantity}
                                            />
                                        }
                                        label="Display Stock Quantity"
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        Settings
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.hasDiscountsApplied}
                                            />
                                        }
                                        label="Has Discounts Applied"
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.notReturnable}
                                            />
                                        }
                                        label="Not Returnable"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.isTaxExempt}
                                            />
                                        }
                                        label="Tax Exempt"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.showOnHomepage}
                                            />
                                        }
                                        label="Show On Homepage"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.isFreeShipping}
                                            />
                                        }
                                        label="Free Shipping"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.allowCustomerReviews}
                                            />
                                        }
                                        label="Allow Customer Reviews"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.disableBuyButton != undefined ? row.original?.disableBuyButton : false}
                                            />
                                        }
                                        label="Disable Buy Button"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.disableWishlistButton}
                                            />
                                        }
                                        label="Disable Wishlist Button"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.availableForPreOrder}
                                            />
                                        }
                                        label="Available For Pre Order"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.callForPrice}
                                            />
                                        }
                                        label="Call For Price"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                                <Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={row.original?.markAsNew}
                                            />
                                        }
                                        label="Mark As New"
                                    />
                                </Stack>
                            </Grid>
                            {row.original?.markAsNew && <>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                    <Stack>
                                        <InputLabel htmlFor="markAsNewStartDateTimeUtc">{t(fieldsName + 'markAsNewStartDateTimeUtc')}</InputLabel>
                                        <OutlinedInput
                                            id="markAsNewStartDateTimeUtc"
                                            type="text"
                                            value={row.original.markAsNewStartDateTimeUtc
                                                ? new Intl.DateTimeFormat(language, {
                                                    dateStyle: 'long',
                                                    timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                                                    hour12: false
                                                }).format(moment(row.original.markAsNewStartDateTimeUtc).toDate()) : ''}

                                            fullWidth
                                            disabled
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                    <Stack>
                                        <InputLabel htmlFor="markAsNewEndDateTimeUtc">{t(fieldsName + 'markAsNewEndDateTimeUtc')}</InputLabel>
                                        <OutlinedInput
                                            id="markAsNewEndDateTimeUtc"
                                            type="text"
                                            value={row.original.markAsNewEndDateTimeUtc
                                                ? new Intl.DateTimeFormat(language, {
                                                    dateStyle: 'long',
                                                    timeStyle: CONFIG.TIME_STYLE as "short" | "full" | "long" | "medium" | undefined,
                                                    hour12: false
                                                }).format(moment(row.original.markAsNewEndDateTimeUtc).toDate()) : ''}

                                            fullWidth
                                            disabled
                                        />
                                    </Stack>
                                </Grid>
                            </>
                            }
                        </Grid>
                    </AccordionDetails>
                </Accordion>

            </Grid>
        </Grid>
    );
};