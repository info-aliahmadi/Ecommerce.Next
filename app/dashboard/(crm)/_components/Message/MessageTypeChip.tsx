import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { renderColor, renderTitle } from './MessageType';
// ===============================|| COLOR BOX ||=============================== //

export default function MessageTypeChip({ messageTypeId }:{ messageTypeId : MessageType }) {
  const [t] = useTranslation();
  const fieldsName = 'fields.message.messageInbox.messageType.';

  return (
    <Chip
      color={renderColor(messageTypeId)}
      label={t(fieldsName + renderTitle(messageTypeId))}
      sx={{ borderRadius: '16px' }}
      variant="filled"
      size="medium"
    />
  );
}