
interface NotifyProps {
    type?: 'error' | 'success' | 'warning';
    description?: any;
    open: boolean;
    title?: string;
    position?: Position;
    autoHideDuration?: number;
}

interface Position {
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}
type setNotify = (notify: NotifyProps) => void;