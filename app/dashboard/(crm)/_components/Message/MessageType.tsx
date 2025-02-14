// ===============================|| COLOR BOX ||=============================== //

export const renderColor = (m : number) => {
  switch (m) {
    case MessageType.Private:
      return 'primary';
    case MessageType.Public:
      return 'success';
    case MessageType.Contact:
      return 'warning';
    case MessageType.Request:
      return 'error';
    default:
      return 'default';
  }
};
export const renderTitle = (m: number) => {
  switch (m) {
    case MessageType.Private:
      return 'private';
    case MessageType.Public:
      return 'public';
    case MessageType.Contact:
      return 'contact';
    case MessageType.Request:
      return 'request';
    default:
      return 'default';
  }
};

export const MessageTypes = [
  { id: 0, title: 'Private' },
  { id: 1, title: 'Public' },
  { id: 2, title: 'Contact' },
  { id: 3, title: 'Request' }
];
