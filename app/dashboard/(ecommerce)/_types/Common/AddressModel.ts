/**
 * Represents an address.
 */
export default interface AddressModel {
    /**
     * Unique identifier for the address.
     */
    id: number;
  
    /**
     * Identifier of the user associated with this address.
     */
    userId: number;
  
    /**
     * Identifier of the country for this address.
     */
    countryId: number;

    /**
     * Identifier of the country for this address.
     */
    countryName: string;
  
    /**
     * Identifier of the state or province for this address.
     */
    stateProvinceId: number;
    /**
     * Identifier of the state or province for this address.
     */
    stateProvinceName: string;
  
    /**
     * City name for this address.
     */
    city: string;
  
    /**
     * County name for this address.
     */
    county: string;
  
    /**
     * First name associated with this address.
     */
    title: string;
  
  
    /**
     * Phone number associated with this address.
     */
    phoneNumber: string;
  
    /**
     * First line of the address.
     */
    address1: string;
  
    /**
     * Zip or postal code for this address.
     */
    zipPostalCode: string;
  
    /**
     * Zip or postal code for this address.
     */
    geoLocation: string;
    
    /**
     * default address
     */
    isDefault: boolean;

    /**
     * Date and time when this address was created (UTC).
     */
    createdOnUtc: Date;
  
    /**
     * Number of orders associated with this address.
     */
    orders: number;
  }