// project import
import authRoutes from '@dashboard/(auth)/_lib/routes';
import settingsRoutes from '@dashboard/(settings)/_lib/routes';
import cmsRoutes from '@dashboard/(cms)/_lib/routes';


// ==============================|| MENU ITEMS ||============================== //

const AllRoutes ={ routes : [...authRoutes, ...settingsRoutes, ...cmsRoutes]};
  
export default AllRoutes;
