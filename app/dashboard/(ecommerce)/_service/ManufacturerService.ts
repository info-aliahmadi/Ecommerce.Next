import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import ManufacturerModel from '../_types/Product/ManufacturerModel';
import CONFIG from '@root/config';

export default class ManufacturerService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getManufacturerList = async (): Promise<Result<ManufacturerModel[]>> => {
    return Fetch.Get<Result<ManufacturerModel[]>>(CONFIG.API_BASEPATH + `/Product/getManufacturerList`, this.config);
  };

  getManufacturerListForSelect = async (): Promise<Result<ManufacturerModel[]>> => {
    return Fetch.Get<Result<ManufacturerModel[]>>(CONFIG.API_BASEPATH + `/Product/getManufacturersForSelect`, this.config);
  };

  getAllManufacturers = async (): Promise<Result<ManufacturerModel[]>> => {
    return Fetch.Get<Result<ManufacturerModel[]>>(CONFIG.API_BASEPATH + `/Product/getAllManufacturers`, this.config);
  };
  getManufacturerById = async (manufacturerId : number): Promise<Result<ManufacturerModel>> => {
    const params = new URLSearchParams({ manufacturerId: manufacturerId.toString() });
    return Fetch.Get<Result<ManufacturerModel>>(CONFIG.API_BASEPATH + `/Product/getManufacturerById?${params.toString()}`, this.config);
  };
  addManufacturer = async (manufacturer: ManufacturerModel): Promise<Result<ManufacturerModel>> => {
    return Fetch.Post<Result<ManufacturerModel>>(CONFIG.API_BASEPATH + '/Product/addManufacturer', manufacturer, this.config);
  };
  updateManufacturer = async (manufacturer: ManufacturerModel): Promise<Result<ManufacturerModel>> => {
    return Fetch.Post<Result<ManufacturerModel>>(CONFIG.API_BASEPATH + '/Product/updateManufacturer', manufacturer, this.config);
  };
  // create function to order manufacturers
  orderManufacturers = async (manufacturers: ManufacturerModel[]): Promise<Result<ManufacturerModel[]>> => {
    return Fetch.Post<Result<ManufacturerModel[]>>(CONFIG.API_BASEPATH + '/Product/UpdateManufacturerOrders', manufacturers, this.config);
  };
  
  deleteManufacturer = async (manufacturerId : number): Promise<Result<ManufacturerModel>> => {
    const params = new URLSearchParams({ manufacturerId: manufacturerId.toString() });
    return Fetch.Get<Result<ManufacturerModel>>(CONFIG.API_BASEPATH + `/Product/deleteManufacturer?${params.toString()}`, this.config);
  };
}
