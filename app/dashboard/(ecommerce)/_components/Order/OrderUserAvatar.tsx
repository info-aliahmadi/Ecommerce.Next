import Avatar from '@mui/material/Avatar';
import CONFIG from '@root/config';

export default function OrderUserAvatar({ value, avatar }: Readonly<{ value: string; avatar?: string }>) {
  return (
    <>
      <Avatar alt="" src={avatar ? CONFIG.AVATAR_BASEPATH + avatar : ''} sx={{ width: 50, height: 50 }}></Avatar>
      <span>{value}</span>
    </>
  );
}
