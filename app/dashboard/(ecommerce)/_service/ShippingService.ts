import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import ShipmentModel from '../_types/Order/ShipmentModel';

export default class ShipmentService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getShipmentList = async (): Promise<Result<ShipmentModel[]>> => {
    return Fetch.Get<Result<ShipmentModel[]>>(CONFIG.API_BASEPATH + `/Order/GetShipmentList`, this.config);
  };
  getShipmentById = async (shipmentId: number): Promise<Result<ShipmentModel>> => {
    const params = new URLSearchParams({ shipmentId: shipmentId.toString() });
    return Fetch.Get<Result<ShipmentModel>>(CONFIG.API_BASEPATH + `/Order/getShipmentById?${params.toString()}`, this.config);
  };
  addShipment = async (shipment: ShipmentModel): Promise<Result<ShipmentModel>> => {
    return Fetch.Post<Result<ShipmentModel>>(CONFIG.API_BASEPATH + '/Order/addShipment', shipment, this.config);
  };
  updateShipment = async (shipment: ShipmentModel): Promise<Result<ShipmentModel>> => {
    return Fetch.Post<Result<ShipmentModel>>(CONFIG.API_BASEPATH + '/Order/updateShipment', shipment, this.config);
  };
  deleteShipment = async (shipmentId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ shipmentId: shipmentId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Order/deleteShipment?${params.toString()}`, this.config);
  };
}
