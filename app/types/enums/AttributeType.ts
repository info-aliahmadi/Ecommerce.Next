 enum AttributeType
{
    Color = 0,
    Size = 1,
    Weight = 2,
    Length = 3,
    Width = 4,
    Height = 5,
    Material = 6,
    Style = 7,
    Pattern = 8,
    Brand = 9,
    Model = 10,

}
export default AttributeType;

export const attributeTypeLabelKeys: Record<number, string> = {
    [AttributeType.Color]: "fields.productAttribute.attributeTypes.Color",
    [AttributeType.Size]: "fields.productAttribute.attributeTypes.Size",
    [AttributeType.Weight]: "fields.productAttribute.attributeTypes.Weight",
    [AttributeType.Length]: "fields.productAttribute.attributeTypes.Length",
    [AttributeType.Width]: "fields.productAttribute.attributeTypes.Width",
    [AttributeType.Height]: "fields.productAttribute.attributeTypes.Height",
    [AttributeType.Material]: "fields.productAttribute.attributeTypes.Material",
    [AttributeType.Style]: "fields.productAttribute.attributeTypes.Style",
    [AttributeType.Pattern]: "fields.productAttribute.attributeTypes.Pattern",
    [AttributeType.Brand]: "fields.productAttribute.attributeTypes.Brand",
    [AttributeType.Model]: "fields.productAttribute.attributeTypes.Model",
};