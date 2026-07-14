import { ImageNotSupported } from "@mui/icons-material";
import { Avatar, Box, Chip, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, Switch, TextField, Typography } from "@mui/material";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

    return (
        <Grid container spacing={3} direction="row">
            <Grid container spacing={3} size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} direction="row" sx={{ justifyContent: "center", alignItems: "center" }}>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                    <Stack>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                margin: '10px'
                            }}
                        >
                            {row.original.imagePreview ? <Avatar
                                component="img"
                                variant="rounded"
                                loading="lazy"
                                alt="product Preview"
                                src={CONFIG.UPLOAD_BASEPATH + row.original.imagePreview.directory + row.original.imagePreview?.fileName}
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
            <Grid container size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 4 }}>

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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="price">{t(fieldsName + 'price')}</InputLabel>
                                    <OutlinedInput id="price" type="text" value={row.original.variants?.[0]?.sellPrice?.toCurrency(row.original.currencyType) || 'N/A'} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="oldPrice">{t(fieldsName + 'oldPrice')}</InputLabel>
                                    <OutlinedInput id="oldPrice" type="text" value={row.original.variants?.[0]?.oldSellPrice?.toCurrency(row.original.currencyType) || 'N/A'} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                                   <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="variantCount">{t(fieldsName + 'variants.title')}</InputLabel>
                                    <OutlinedInput id="variantCount" type="text" value={row.original.variants?.length || 0} fullWidth disabled />
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
                        Variants
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            {row.original.variants?.map((variant, index) => (
                                <Grid size={12} key={variant.id || index}>
                                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                            Variant #{index + 1} {variant.sku && `- ${variant.sku}`}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'sellPrice')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.sellPrice || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'oldSellPrice')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.oldSellPrice || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'inventory.stockQuantity')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.productInventory?.stockQuantity || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'inventory.reservedQuantity')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.productInventory?.reservedQuantity || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            {variant.productAttributes?.length > 0 && (
                                                <Grid size={12}>
                                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                                        {variant.productAttributes.map((attr) => (
                                                            <Chip key={attr.id} label={`${attr.name}: ${attr.value}`} size="small" />
                                                        ))}
                                                    </Stack>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                </Grid>
                            ))}

                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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

                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
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
                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
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
                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
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