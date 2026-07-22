import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import CountryModel from '@root/app/dashboard/(ecommerce)/_types/Common/CountryModel';
import StateProvinceModel from '@root/app/dashboard/(ecommerce)/_types/Common/StateProvinceModel';

export default class ProfileService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getUserAddresses = async (): Promise<Result<AddressModel[]>> => {
    return Fetch.Get<Result<AddressModel[]>>(CONFIG.API_BASEPATH + `/Common/GetUserAddresses`, this.config);
  };

  addAddress = async (address: AddressModel): Promise<Result<AddressModel>> => {
    return Fetch.Post<Result<AddressModel>>(CONFIG.API_BASEPATH + '/Common/addAddress', address, this.config);
  };

  updateAddress = async (address: AddressModel): Promise<Result<AddressModel>> => {
    return Fetch.Post<Result<AddressModel>>(CONFIG.API_BASEPATH + '/Common/updateAddress', address, this.config);
  };

  setAsDefaultAddress = async (addressId: number): Promise<Result<boolean>> => {
    const params = new URLSearchParams({ addressId: addressId.toString() });
    return Fetch.Get<Result<boolean>>(CONFIG.API_BASEPATH + `/Common/SetAsDefault?${params.toString()}`, this.config);
  };

  deleteAddress = async (addressId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ addressId: addressId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Common/deleteAddress?${params.toString()}`, this.config);
  };

  getCountriesForSelect = async (): Promise<Result<CountryModel[]>> => {
    return Fetch.Get<Result<CountryModel[]>>(CONFIG.API_BASEPATH + `/Common/GetCountriesForSelect`, this.config);
  };

  getStateProvincesForSelect = async (countryId: number): Promise<Result<StateProvinceModel[]>> => {
    const params = new URLSearchParams({ countryId: countryId.toString() });
    return Fetch.Get<Result<StateProvinceModel[]>>(CONFIG.API_BASEPATH + `/Common/GetStateProvincesForSelect?${params.toString()}`, this.config);
  };

}
