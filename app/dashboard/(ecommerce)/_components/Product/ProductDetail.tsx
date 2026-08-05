import { ImageNotSupported } from "@mui/icons-material";
import { Avatar, Box, Chip, FormControlLabel, Grid, InputLabel, OutlinedInput, Select, MenuItem, Stack, Switch, Typography } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocale, useTranslations } from 'next-intl';
import CONFIG from '@root/config';
import ProductModel from '../../_types/Product/ProductModel';
import { MRT_Row } from 'material-react-table';
import { DateTimeViewer } from "@root/utils/DateViewer";
import DeliveryDateType from '@root/app/types/enums/DeliveryDateType';
import { Locale } from "@root/locales/Language";

export default function ProductDetail({ row }: { row: MRT_Row<ProductModel> }) {
    const t = useTranslations("");
    const fieldsName = 'fields.product.';
    const language = useLocale() as Locale;

    const deliveryDateLabels: Record<number, string> = {
        [DeliveryDateType.OneDay]: t("fields.order.deliveryDate.OneDay"),
        [DeliveryDateType.ThreeDays]: t("fields.order.deliveryDate.ThreeDays"),
        [DeliveryDateType.OneWeek]: t("fields.order.deliveryDate.OneWeek"),
        [DeliveryDateType.OneMonth]: t("fields.order.deliveryDate.OneMonth"),
    };

    return (
        <Grid container spacing={3} direction="row">
            {/* Product Image & Name */}
            <Grid container spacing={3} size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} direction="row" sx={{ justifyContent: "center", alignItems: "center" }}>
                <Grid size={12}>
                    <Stack>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '10px' }}>
                            {row.original.imagePreview ? (
                                <Avatar
                                    variant="rounded"
                                    alt={row.original.name}
                                    src={CONFIG.UPLOAD_BASEPATH + row.original.imagePreview.directory + row.original.imagePreview?.fileName}
                                    sx={{ width: 200, height: 200 }}
                                />
                            ) : (
                                <Avatar variant="rounded" sx={{ width: 200, height: 200 }}>
                                    <ImageNotSupported />
                                </Avatar>
                            )}
                            <span>{row.original.name}</span>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>

            {/* Detail Sections */}
            <Grid container size={{ xs: 12, sm: 6, md: 9, lg: 9, xl: 9 }}>

                {/* Base Info */}
                <Accordion defaultExpanded sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-baseInfo-content" id="panel-baseInfo-header">
                        {t(fieldsName + 'tabs.baseInfo')}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'sku')}</InputLabel>
                                    <OutlinedInput type="text" value={row.original.sku || ''} fullWidth disabled />
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'deliveryDateId')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        value={row.original.deliveryDateType || ''}
                                        size="medium"
                                        disabled
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                <Chip label={deliveryDateLabels[selected as number] || ''} sx={{ height: '23px' }} />
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value={row.original.deliveryDateType}>
                                            <span style={{ whiteSpace: 'pre-wrap' }}>{deliveryDateLabels[row.original.deliveryDateType as number] || ''}</span>
                                        </MenuItem>
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'taxCategoryId')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        value={row.original.taxCategoryName || ''}
                                        size="medium"
                                        disabled
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                <Chip label={selected} sx={{ height: '23px' }} />
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value={row.original.taxCategoryName}>
                                            <span style={{ whiteSpace: 'pre-wrap' }}>{row.original.taxCategoryName}</span>
                                        </MenuItem>
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'categoryIds')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        multiple
                                        value={row.original.categoryNames || []}
                                        size="medium"
                                        disabled
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value, index) => (
                                                    <Chip key={'chip-' + index} label={value} sx={{ height: '23px' }} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {row.original.categoryNames?.map((item) => (
                                            <MenuItem key={'menu-' + item} value={item}>
                                                <span style={{ whiteSpace: 'pre-wrap' }}>{item}</span>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'manufacturerIds')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        multiple
                                        value={row.original.manufacturerNames || []}
                                        size="medium"
                                        disabled
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value, index) => (
                                                    <Chip key={'chip-' + index} label={value} sx={{ height: '23px' }} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {row.original.manufacturerNames?.map((item) => (
                                            <MenuItem key={'menu-' + item} value={item}>
                                                <span style={{ whiteSpace: 'pre-wrap' }}>{item}</span>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'attributeIds')}</InputLabel>
                                    <Select
                                        className="select-margin"
                                        multiple
                                        value={row.original.attributeNames || []}
                                        size="medium"
                                        disabled
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value, index) => (
                                                    <Chip key={'chip-' + index} label={value} sx={{ height: '23px' }} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {row.original.attributeNames?.map((item) => (
                                            <MenuItem key={'menu-' + item} value={item}>
                                                <span style={{ whiteSpace: 'pre-wrap' }}>{item}</span>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'availableStartDateTimeUtc')}</InputLabel>
                                    <OutlinedInput type="text" value={DateTimeViewer(language, row.original.availableStartDateTimeUtc)} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'availableEndDateTimeUtc')}</InputLabel>
                                    <OutlinedInput type="text" value={DateTimeViewer(language, row.original.availableEndDateTimeUtc)} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Stack spacing={1}>
                                    <InputLabel>{t(fieldsName + 'shortDescription')}</InputLabel>
                                    <div
                                        className="text-sm text-ecommerce-text-secondary mt-3 px-3 py-2.5 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border/50 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: row.original.shortDescription }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Variants */}
                <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-variants-content" id="panel-variants-header">
                        {t(fieldsName + 'tabs.variants')}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            {row.original.variants?.map((variant, index) => (
                                <Grid size={12} key={row.original.id + `variant-${variant.id ?? index}`}>
                                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                            {t(fieldsName + 'variants.variant', { index: index + 1 })} {variant.sku && `- ${variant.sku}`}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'variants.sellPrice')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.sellPrice || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'variants.oldSellPrice')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.oldSellPrice || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'variants.inventory.stockQuantity')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.productInventory?.stockQuantity || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Stack>
                                                    <InputLabel>{t(fieldsName + 'variants.inventory.reservedQuantity')}</InputLabel>
                                                    <OutlinedInput type="text" value={variant.productInventory?.reservedQuantity || 0} fullWidth disabled />
                                                </Stack>
                                            </Grid>
                                            {variant.productAttributes?.length > 0 && (
                                                <Grid size={12}>
                                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                                        {variant.productAttributes.map((attr) => (
                                                            <Chip key={attr.id} label={`${attr.name}: ${attr.key}`} size="small" />
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
                                        control={<Switch checked={row.original?.notifyAdminForQuantityBelow} />}
                                        label={t(fieldsName + 'notifyAdminForQuantityBelow')}
                                    />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack>
                                    <FormControlLabel
                                        control={<Switch checked={row.original?.allowedQuantities} />}
                                        label={t(fieldsName + 'allowedQuantities')}
                                    />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                <Stack>
                                    <FormControlLabel
                                        control={<Switch checked={row.original?.displayStockQuantity} />}
                                        label={t(fieldsName + 'displayStockQuantity')}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Settings */}
                <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-settings-content" id="panel-settings-header">
                        {t(fieldsName + 'tabs.settings')}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack spacing={1}>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.hasDiscountsApplied} />} label={t(fieldsName + 'hasDiscountsApplied')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.notReturnable} />} label={t(fieldsName + 'notReturnable')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.isTaxExempt} />} label={t(fieldsName + 'isTaxExempt')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.showOnHomepage} />} label={t(fieldsName + 'showOnHomepage')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.isFreeShipping} />} label={t(fieldsName + 'isFreeShipping')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.allowCustomerReviews} />} label={t(fieldsName + 'allowCustomerReviews')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.disableBuyButton ?? false} />} label={t(fieldsName + 'disableBuyButton')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.disableWishlistButton} />} label={t(fieldsName + 'disableWishlistButton')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.availableForPreOrder} />} label={t(fieldsName + 'availableForPreOrder')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.callForPrice} />} label={t(fieldsName + 'callForPrice')} />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
                                <Stack>
                                    <FormControlLabel control={<Switch disabled checked={row.original?.markAsNew} />} label={t(fieldsName + 'markAsNew')} />
                                </Stack>
                            </Grid>
                            {row.original?.markAsNew && (
                                <>
                                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
                                        <Stack>
                                            <InputLabel htmlFor="markAsNewStartDateTimeUtc">{t(fieldsName + 'markAsNewStartDateTimeUtc')}</InputLabel>
                                            <OutlinedInput type="text" value={DateTimeViewer(language, row.original.markAsNewStartDateTimeUtc)} fullWidth disabled />
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
                                        <Stack>
                                            <InputLabel htmlFor="markAsNewEndDateTimeUtc">{t(fieldsName + 'markAsNewEndDateTimeUtc')}</InputLabel>
                                            <OutlinedInput type="text" value={DateTimeViewer(language, row.original.markAsNewEndDateTimeUtc)} fullWidth disabled />
                                        </Stack>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* SEO */}
                <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-seo-content" id="panel-seo-header">
                        {t(fieldsName + 'tabs.seo')}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3} >
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="metaTitle">{t(fieldsName + 'metaTitle')}</InputLabel>
                                    <OutlinedInput id="metaTitle" type="text" value={row.original.metaTitle || ''} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="metaKeywords">{t(fieldsName + 'metaKeywords')}</InputLabel>
                                    <OutlinedInput id="metaKeywords" type="text" value={row.original.metaKeywords || ''} fullWidth disabled />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="metaDescription">{t(fieldsName + 'metaDescription')}</InputLabel>
                                    <OutlinedInput id="metaDescription" type="text" value={row.original.metaDescription || ''} fullWidth disabled />
                                </Stack>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
}