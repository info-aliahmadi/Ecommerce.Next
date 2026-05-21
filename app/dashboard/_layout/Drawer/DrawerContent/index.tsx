// project import
import SimpleBar from '@dashboard/_components/third-party/SimpleBar';
import Navigation from './Navigation';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      <Navigation />
      {/* <NavCard /> */}
    </SimpleBar>
  );
};

export default DrawerContent;
