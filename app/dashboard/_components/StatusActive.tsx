import Dot from '@root/app/dashboard/_components/@extended/Dot';
import { Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";

const StatusActive = ({ status }: any) => {
  const t = useTranslations("");
  let color: string = '';
  let title: string = '';

  switch (status) {
    case true:
      color = 'success';
      title = t('status.active');
      break;
    default:
      color = 'error';
      title = t('status.deActive');
      break;
  }
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} >
      <Dot color={color} size={16} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

export default StatusActive;