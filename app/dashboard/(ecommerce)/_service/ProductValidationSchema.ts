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
        .required(t(validation + 'requiredFullDescription')),
      categoryIds: Yup.array()
        .min(1, t(validation + 'requiredCategoryIds'))
        .required(t(validation + 'requiredCategoryIds')),
      deliveryDateType: Yup.number()
        .required(t(validation + 'requiredDeliveryDateId')),
      taxCategoryId: Yup.number()
        .required(t(validation + 'requiredTaxCategoryId')),
      stockQuantity: Yup.number()
        .required(t(validation + 'requiredStockQuantity')),
      minStockQuantity: Yup.number()
        .required(t(validation + 'requiredMinStockQuantity')),
      orderMinimumQuantity: Yup.number()
        .required(t(validation + 'requiredOrderMinimumQuantity')),
      orderMaximumQuantity: Yup.number()
        .required(t(validation + 'requiredOrderMaximumQuantity')),
      price: Yup.number()
        .required(t(validation + 'requiredPrice')),
      currencyId: Yup.number()
        .required(t(validation + 'requiredCurrencyId'))
    })
    .strict(false); // Allow extra fields without validation errors
};
