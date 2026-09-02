export enum MeasureType {
    Kilogram = 1,
    Number = 2,
    Box = 3,
    Meter = 4,
    Litr = 5,
    Gram = 6,
    Mesghal = 7
}
export default MeasureType;

export const measureTypeLabelKeys: Record<number, string> = {
    [MeasureType.Kilogram]: "fields.product.measureTypes.Kilogram",
    [MeasureType.Number]: "fields.product.measureTypes.Number",
    [MeasureType.Box]: "fields.product.measureTypes.Box",
    [MeasureType.Meter]: "fields.product.measureTypes.Meter",
    [MeasureType.Litr]: "fields.product.measureTypes.Litr",
    [MeasureType.Gram]: "fields.product.measureTypes.Gram",
    [MeasureType.Mesghal]: "fields.product.measureTypes.Mesghal"
};