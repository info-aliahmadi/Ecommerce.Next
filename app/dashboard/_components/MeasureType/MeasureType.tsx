import { Stack } from '@mui/material';
import MeasureType from '@root/app/types/enums/MeasureType';

export const GetMeasureType = (measureTypeId: any, t: any) => {
  const measureTypeKey = MeasureType[measureTypeId as MeasureType];
  const title = t(`fields.product.measureType.${measureTypeKey}`);

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} >
      {title}
    </Stack>
  );
};

export const GetMeasureTypeString = (measureTypeId: any, t: any): string => {
  const measureTypeKey = MeasureType[measureTypeId as MeasureType];
  const title = t(`fields.product.measureType.${measureTypeKey}`);

  return title;
};
