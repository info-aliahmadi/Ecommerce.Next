/**
 * Represents an address.
 */
interface AddressModel {
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
     * Identifier of the state or province for this address.
     */
    stateProvinceId: number;
  
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
    firstName: string;
  
    /**
     * Last name associated with this address.
     */
    lastName: string;
  
    /**
     * Phone number associated with this address.
     */
    phoneNumber: string;
  
    /**
     * Email address associated with this address.
     */
    email: string;
  
    /**
     * Company name associated with this address.
     */
    company: string;
  
    /**
     * First line of the address.
     */
    address1: string;
  
    /**
     * Second line of the address (optional).
     */
    address2: string;
  
    /**
     * Zip or postal code for this address.
     */
    zipPostalCode: string;
  
    /**
     * Fax number associated with this address.
     */
    faxNumber: string;
  
    /**
     * Date and time when this address was created (UTC).
     */
    createdOnUtc: Date;
  
    /**
     * Number of orders associated with this address.
     */
    orders: number;
  }