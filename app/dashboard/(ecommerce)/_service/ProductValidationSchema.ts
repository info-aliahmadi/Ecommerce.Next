import * as Yup from 'yup';

/**
 * Creates a Yup validation schema for Product form validation
 * @param t - Translation function to get localized error messages
 * @returns Yup object schema for product validation
 */
export const createProductValidationSchema = (t: (key: string) => string) => {
  const validation = 'validation.product.';

  return Yup.object()
    .shape({
      name: Yup.string()
        .max(250, t(validation + 'maxName'))
        .required(t(validation + 'requiredName')),
      fullDescription: Yup.string()
        .min(77, t(validation + 'requiredFullDescription'))
        .required(t(validation + 'requiredFullDescription')),
      deliveryDateType: Yup.number()
        .required(t(validation + 'requiredDeliveryDateType')),
      taxCategoryId: Yup.number()
        .required(t(validation + 'requiredTaxCategoryId')),
      minStockQuantity: Yup.number()
        .required(t(validation + 'requiredMinStockQuantity')),
      orderMinimumQuantity: Yup.number()
        .required(t(validation + 'requiredOrderMinimumQuantity')),
      orderMaximumQuantity: Yup.number()
        .required(t(validation + 'requiredOrderMaximumQuantity')),
      sellUnitPrice: Yup.number().min(1, t(validation + 'requiredSellUnitPrice'))
        .required(t(validation + 'requiredSellUnitPrice')),
      picturePreviewId: Yup.number().min(1, t(validation + 'requiredPicturePreviewId'))
        .required(t(validation + 'requiredPicturePreviewId')),
      measureType: Yup.number()
        .required(t(validation + 'requiredMeasureType')),
      availableStartDateTimeUtc: Yup.date()
        .required(t(validation + 'requiredavailableStartDateTimeUtc')),
      inventories: Yup.array()
        .min(1, t(validation + 'requiredInventories'))
        .required(t(validation + 'requiredInventories')),
      categoryIds: Yup.array()
        .min(1, t(validation + 'requiredCategoryIds'))
        .required(t(validation + 'requiredCategoryIds')),
      manufacturerIds: Yup.array()
        .min(1, t(validation + 'requiredManufacturerIds'))
        .required(t(validation + 'requiredManufacturerIds'))
    })
    .strict(false); // Allow extra fields without validation errors
};
