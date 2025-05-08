// project import
import authRoutes from '@dashboard/(auth)/_lib/routes';
import settingsRoutes from '@dashboard/(settings)/_lib/routes';
import cmsRoutes from '@dashboard/(cms)/_lib/routes';
import crmRoutes from '@dashboard/(crm)/_lib/routes';
import ecommerceRoutes from '@dashboard/(ecommerce)/_lib/routes';
import filestorageRoutes from '@dashboard/(filestorage)/_lib/routes';

// ==============================|| MENU ITEMS ||============================== //

const AllRoutes = { routes: [...authRoutes, ...settingsRoutes, ...cmsRoutes, ...crmRoutes, ...ecommerceRoutes, ...filestorageRoutes] };

export default AllRoutes;
