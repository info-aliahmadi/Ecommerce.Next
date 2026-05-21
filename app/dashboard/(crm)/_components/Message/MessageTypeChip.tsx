import { Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { renderColor, renderTitle } from './MessageType';
// ===============================|| COLOR BOX ||=============================== //
import { MessageType } from '../../_types/MessageModel';

export default function MessageTypeChip({ messageTypeId }:{ messageTypeId : MessageType }) {
  const t = useTranslations("");
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